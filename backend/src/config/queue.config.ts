import { Queue } from 'bullmq';
import Redis from 'ioredis';  

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Dedicated connection for BullMQ
export const queueConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Strictly required by BullMQ
});

// Initialize your Queue
export const videoUploadQueue = new Queue('videoUpload', {
  connection: queueConnection,
});

