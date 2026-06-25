import {Worker} from 'bullmq'
import dotenv from 'dotenv';
import { queueConnection }from '../config/queue.config';
import { File, IFood } from '../types';
import{ processBackgroundUpload} from '../services/food.service';
import mongoose from 'mongoose';

dotenv.config();
mongoose.set('bufferCommands', false);

// 3. Establish the database connection FOR THIS PROCESS
const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/zomatoDb';
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Worker successfully connected to MongoDB database.' , mongoUri))
  .catch((err) => console.error('❌ Worker failed to connect to MongoDB:', err))
console.log('Ready to process background uploads for food items...')


const worker = new Worker('videoUpload', async (job) => {
  console.log(`Processing job ${job.id} for food item: ${job.data.foodItemId}`);
  const { foodItemId, type, file } = job.data;
  
  // Reconstruct the file buffer structure
  const fileData:File = {
    fileBuffer: Buffer.from(file.fileBuffer, 'base64'),
    fileName: file.fileName,
    mimeType: file.mimeType
  };
  console.log('file Buffer Ready for processing:', fileData.fileBuffer.length, 'bytes')

  // Run the background upload processing service method
  await processBackgroundUpload(foodItemId, fileData, type);
  
  console.log(`Successfully completed upload for food item: ${foodItemId}`);
}, { connection: queueConnection });


  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully.`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error: ${err.message}`);
  })