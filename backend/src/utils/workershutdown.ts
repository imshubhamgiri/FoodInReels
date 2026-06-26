// src/utils/workerShutdown.ts
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import mongoose from 'mongoose';

interface WorkerShutdownDeps {
  worker: Worker;
  queueConnection: Redis;
  redisClient?: Redis;
}

let isWorkerShuttingDown = false;

export function registerWorkerShutdownHandlers({ worker, queueConnection, redisClient }: WorkerShutdownDeps) {
  async function gracefulWorkerShutdown(term: string) {
    if (isWorkerShuttingDown) process.exit(1);
    isWorkerShuttingDown = true;
    console.log(`\n[WORKER-SHUTDOWN] Received ${term}, releasing active jobs...`);

    try {
      if (worker) {
        // This tells Redis: "I am going offline, safe-keep my current jobs!"
        await worker.close();
        console.log('[WORKER-SHUTDOWN] BullMQ Worker closed cleanly.');
      }
      if (mongoose?.connection?.readyState !== 0) {
        await mongoose.connection.close();
        console.log('[WORKER-SHUTDOWN] MongoDB connection closed.');
      }
      if (queueConnection && queueConnection.status !== 'end') {
        await queueConnection.quit();
      }
      if (redisClient && redisClient !== queueConnection && redisClient.status !== 'end') {
        await redisClient.quit();
      }
      process.exit(0);
    } catch (error) {
      console.error('[WORKER-SHUTDOWN] Error:', error);
      process.exit(1);
    }
  }

  process.on('SIGTERM', () => gracefulWorkerShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulWorkerShutdown('SIGINT'));
}
