import Redis from 'ioredis';

// BullMQ compatible client connection options
export const redisConfig = {
  maxRetriesPerRequest: null, // CRITICAL: Must be null for BullMQ ecosystems
  enableReadyCheck: false
};

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  ...redisConfig,
  maxRetriesPerRequest: 3, // Safe for standard key-value side operations only
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;