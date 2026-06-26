import { Worker } from 'bullmq'
import dotenv from 'dotenv';
import { queueConnection } from '../config/queue.config';
import { File, IFood } from '../types';
import { processBackgroundUpload ,deleteFoodItem } from '../services/food.service';
import mongoose from 'mongoose';
import Redis from 'ioredis'

dotenv.config();
mongoose.set('bufferCommands', false);

const redisPublisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
// let partnerId: string = '';

// 3. Establish the database connection FOR THIS PROCESS
const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/zomatoDb';
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Worker successfully connected to MongoDB database.'))
  .catch((err) => console.error('❌ Worker failed to connect to MongoDB:', err))
console.log('Ready to process background uploads for food items...')


const worker = new Worker('videoUpload', async (job) => {
  console.log(`Processing job ${job.id} for food item: ${job.data.foodItemId}`);
  const { foodItemId, type, file , partnerId } = job.data;

  // Reconstruct the file buffer structure
  const fileData: File = {
    fileBuffer: Buffer.from(file.fileBuffer, 'base64'),
    fileName: file.fileName,
    mimeType: file.mimeType
  };
  console.log('file Buffer Ready for processing:', fileData.fileBuffer.length, 'bytes')

  // Run the background upload processing service method
  await processBackgroundUpload(foodItemId, fileData, type);

  console.log(`Successfully completed upload for food item: ${foodItemId}`);


  // Stream a lightweight message back to the main server process via Redis
  await redisPublisher.publish('video_updates', JSON.stringify({
    status: 'completed',
    partnerId,
    foodItemId,
    message: 'Your reel has been successfully processed!'
  }));



}, { connection: queueConnection });


worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

worker.on('failed', async (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);

 if (job && job.name === 'uploadJob') {
    const { foodItemId  , partnerId} = job.data;
    
    console.error(`Job ${job.id} completely failed after all retries: ${err.message}`);

    // OPTION A: Delete the incomplete/broken record entirely (Rollback)
    await deleteFoodItem(foodItemId , partnerId);
    
    // OPTION B: (Alternative) Keep it but update status so user can hit "Retry"
    // const deadItem = await foodModel.findByIdAndUpdate(foodItemId, { uploadStatus: 'failed' });

    //  Stream a lightweight message back to the main server process via Redis
    await redisPublisher.publish('video_updates', JSON.stringify({
      status: 'failed',
      partnerId,
      foodItemId,
      message: 'Video processing failed. Please check your network and try again.'
    }));

  }
})