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
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5 seconds
    },
  },
});




async function run() {
  console.log('Clearing videoUpload queue...');
  try {
    await videoUploadQueue.drain();
    
    const states = ['completed', 'failed', 'delayed', 'paused'] as const;
    await Promise.all(states.map(state => videoUploadQueue.clean(0, 5000, state)));
    
    console.log('✅ Queue cleared successfully!');
  
  } catch (error) {
    console.error('❌ Error clearing queue:', error);
    process.exit(1);
  }
}
run()

