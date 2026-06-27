import dotenv from 'dotenv';
import { Worker } from 'bullmq'
import { registerWorkerShutdownHandlers } from '../utils/workershutdown';
import { queueConnection, videoUploadQueue } from '../config/queue.config';
import { File } from '../types';
import { processBackgroundUpload ,deleteFoodItem } from '../services/food.service';
import mongoose from 'mongoose';
import Redis from 'ioredis'
import fs from 'fs';

dotenv.config();
mongoose.set('bufferCommands', false);

const redisPublisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/zomatoDb';

// Unified Startup sequence to prevent early thread exits on Render
async function bootstrapWorker() {
  try {
    console.log('🔄 Verifying queue state and syncing connections...');
    
    // Resume globally so Render never leaves it frozen
    await videoUploadQueue.resume();
    
    // Safe non-destructive clean of stuck lock tokens from unexpected crashes
    const states = ['active', 'paused'] as const;
    for (const state of states) {
      await videoUploadQueue.clean(0, 0, state);
    }
    console.log('✅ Queue state verified successfully.');

    // Establish Database Connection
    await mongoose.connect(mongoUri);
    console.log('✅ Worker successfully connected to MongoDB database.');
    
    // NOW start the worker so it keeps the process alive permanently
    startBullMQWorker();

  } catch (err) {
    console.error('❌ Critical failure during worker bootstrap sequence:', err);
  }
}

function startBullMQWorker() {
  console.log('Ready to process background uploads for food items...');
  
  const worker = new Worker('videoUpload', async (job) => {
    console.log(`Processing job ${job.id} (Attempt ${job.attemptsMade + 1}) for food item: ${job.data.foodItemId}`);
    const { foodItemId, type, file, partnerId } = job.data;

    if (!fs.existsSync(file.filePath)) {
      console.warn(`File already deleted or missing for job ${job.id}. Skipping processing.`);
      return;
    }

    const fileBuffer = fs.readFileSync(file.filePath);
    const fileData: File = {
      fileBuffer: fileBuffer,
      fileName: file.fileName,
      mimeType: file.mimeType
    };

    try {
      console.log('File Buffer ready for clean event loop execution:', fileData.fileBuffer.length, 'bytes');
      await processBackgroundUpload(foodItemId, fileData, type);
      console.log(`Successfully completed upload for food item: ${foodItemId}`);

      await redisPublisher.publish('video_updates', JSON.stringify({
        status: 'completed',
        partnerId,
        foodItemId,
        message: 'Your reel has been successfully processed!'
      }));

      if (fs.existsSync(file.filePath)) {
        console.log(`Cleaning up temporary file for job ${job.id}: ${file.filePath}`);
        fs.unlinkSync(file.filePath);
      }
    } catch (uploadError) {
      console.error(`Upload attempt failed: ${(uploadError as any).message}`);
      throw uploadError;
    }
  }, {
    connection: queueConnection,
    concurrency: 2,
    lockDuration: 30000,     // 30s is optimal
    stalledInterval: 30000,  // Equal to lockDuration to prevent hanging lock states
    maxStalledCount: 1
  });

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully.`);
  });

  worker.on('failed', async (job, err) => {
    console.error(`Job ${job?.id} failed definitively with error: ${err.message}`);
    if (!job) return;
    try {
      const { foodItemId, partnerId, file } = job.data;
      if (file?.filePath && fs.existsSync(file.filePath)) {
        try { fs.unlinkSync(file.filePath); } catch {}
      }
      try {
        await deleteFoodItem(foodItemId, partnerId);
      } catch (dbErr) {
        console.error(`Could not delete food item during cleanup: ${(dbErr as Error).message}`);
      }
      await redisPublisher.publish('video_updates', JSON.stringify({
        status: 'failed',
        partnerId,
        foodItemId,
        message: 'Video processing failed. Please check your network and try again.'
      }));
    } catch (listenerError) {
      console.error('Fatal failure inside worker error handler:', (listenerError as Error).message);
    }
  });

  registerWorkerShutdownHandlers({
    worker: worker,
    queueConnection: queueConnection,
    redisClient: redisPublisher
  });
}

// Fire up the bootstrap sequence
bootstrapWorker();