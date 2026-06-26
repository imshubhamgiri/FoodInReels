import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Redis from 'ioredis';

// Keep a reference to the instance internally
let io: SocketIOServer | null = null;

export const initSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      // Mirror your global CORS allowance
      origin: "*", 
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const redisSubscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  redisSubscriber.subscribe('video_updates');

  redisSubscriber.on('message', (channel, message) => {
    if (channel === 'video_updates' && io) {
      const data = JSON.parse(message);
      io.to(data.partnerId).emit('video_upload_status', {
        status: data.status,
        foodItemId: data.foodItemId,
        message: data.message
      });
    }
  });

  console.log('[SOCKET] Socket.io initialized successfully.')
  // Setup event listeners
  io.on('connection', (socket) => {
    console.log(`[SOCKET] User connected: ${socket.id}`);
    
    socket.on('join_room', (partnerId: string) => {
      socket.join(partnerId);
      console.log(`[SOCKET] Partner ${partnerId} joined room: ${partnerId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[SOCKET] User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Export a clean getter function to grab the running instance anywhere in your app
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io has not been initialized yet! Call initSocket(server) first.");
  }
  return io;
};