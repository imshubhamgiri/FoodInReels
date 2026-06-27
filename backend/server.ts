import 'dotenv/config';
import app from './src/app';
import { connectDB } from './src/db/db';
import redis from './src/db/redis';
import path from 'path';
import { initSocket } from './src/config/socket.config';
import { createServer } from 'http';
import {videoUploadQueue as jobQueue , queueConnection} from './src/config/queue.config';
import { registerShutdownHandlers } from './src/utils/gracefulShutdown';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

//Create Http server instance to pass to socket.io
const httpServer = createServer(app); 

// Initialize Socket.io via our modular config
const socketServer = initSocket(httpServer);

const startServer = (): void => {
  const entryPoint = process.argv[1] || '';
  const normalizedEntry = entryPoint.split(path.sep).join('/');
  const runtime = normalizedEntry.includes('/dist/') ? 'compiled-js' : 'ts-node';

  const server = httpServer.listen(PORT, HOST, () => {
    console.log(`[BOOT] pid=${process.pid} runtime=${runtime} env=${process.env.NODE_ENV || 'development'} url=http://${HOST}:${PORT}`);
  });

  jobQueue.resume().then(() => {
    console.log('▶️ Video upload queue globally unpaused and ready.');
  });

  // async function GracefulShutdown(Term:string){
  //   console.log(`$[SHUTDOWN] Received ${Term}, shutting down gracefully...`);
  //   await mongoose.connection.close()
  //   await redis.quit();
  //   server.close( async() => {
  //     try {
  //       console.log('[SHUTDOWN] Server closed.');
  //       process.exit(0);  
  //     } catch (error) {
  //       console.error('Error during shutdown:', error);
  //       process.exit(1);
  //     }
  //   });
  // }

  // process.on('SIGTERM', async () => {
  //   await GracefulShutdown('SIGTERM');

  // });

  // process.on('SIGINT', async () => {
  //   await GracefulShutdown('SIGINT');
  // });

 registerShutdownHandlers({
    server, // Your HTTP server instance,
    socketServer, // Your socket instance
    queues: [jobQueue],
    queueConnection,
    redisClient: redis
  });


  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`[BOOT] Port ${PORT} is already in use. Stop the existing server process before starting another one.`);
      process.exit(1);
    }

    console.error('[BOOT] Server listen error:', error);
    process.exit(1);
  });
};

const bootstrap = async (): Promise<void> => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed during startup:', error);
    process.exit(1);
  }
  startServer();

};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

bootstrap().catch((error) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});