import dotenv from 'dotenv';
import { Worker } from 'bullmq'
import { registerWorkerShutdownHandlers } from '../utils/workershutdown';
import { queueConnection, videoUploadQueue } from '../config/queue.config';
import { File } from '../types';
import { processBackgroundUpload ,deleteFoodItem } from '../services/food.service';
import mongoose from 'mongoose';
import Redis from 'ioredis'
import fs from 'fs';


// Add this cleanup sequence before declaring the worker to clear stuck states
(async () => {
  try {
    console.log('🔄 Cleaning up stalled or delayed jobs from previous unexpected crashes...');
    // This safely removes jobs stuck in an active/stalled loop without wiping your entire Redis database
    const states = ['active', 'paused'] as const;
    for (const state of states) {
      await videoUploadQueue.clean(0, 0, state);
    }
  } catch (err) {
    console.error('Non-critical queue clean warning:', err);
  }
})();

dotenv.config();
mongoose.set('bufferCommands', false);

const redisPublisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// 3. Establish the database connection FOR THIS PROCESS
const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/zomatoDb';
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Worker successfully connected to MongoDB database.'))
  .catch((err) => console.error('❌ Worker failed to connect to MongoDB:', err))
console.log('Ready to process background uploads for food items...')


const worker = new Worker('videoUpload', async (job) => {
  console.log(`Processing job ${job.id} (Attempt ${job.attemptsMade + 1}) for food item: ${job.data.foodItemId}`);
  const { foodItemId, type, file, partnerId } = job.data;

  // Prevent crashing if a retry happens but the file was already cleaned up
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

    // CRITICAL: Only delete the file AFTER a definitive SUCCESS
    if (fs.existsSync(file.filePath)) {
      console.log(`Cleaning up temporary file for job ${job.id}: ${file.filePath}`);
      fs.unlinkSync(file.filePath);
    }

  } catch (uploadError) {
    console.error(`Upload attempt failed: ${(uploadError as any).message}`);
    throw uploadError; // Rethrow so BullMQ knows it failed and can evaluate retries
  }
}, { 
  connection: queueConnection,
  concurrency: 2,          
  lockDuration: 45000,     // Increased to 45s to prevent accidental stall triggers during large video uploads
  stalledInterval: 15000,  
  maxStalledCount: 1       
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

// Safe global failed listener
worker.on('failed', async (job, err) => {
  console.error(`Job ${job?.id} failed definitively with error: ${err.message}`);
  
  if (!job) return;

  try {
    const { foodItemId, partnerId, file } = job.data;
    
    // 1. Safe File Cleanup
    if (file?.filePath && fs.existsSync(file.filePath)) {
      try { fs.unlinkSync(file.filePath); } catch {}
    }

    // 2. Safe Database Handling (Wrap in try/catch to prevent process crash)
    try {
      await deleteFoodItem(foodItemId, partnerId);
    } catch (dbErr) {
      console.error(`Could not delete food item during cleanup: ${(dbErr as Error).message}`);
    }
    
    // 3. Notify Client
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
  worker: worker, // your instantiated BullMQ Worker variable
  queueConnection: queueConnection,
  redisClient: redisPublisher
});