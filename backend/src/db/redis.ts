import Redis from 'ioredis';
console.log('Connecting to Redis...');
console.log('REDIS_URL:', process.env.REDIS_URL );
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379',{
    maxRetriesPerRequest: 3,
});


redis.on('connect', () => {
    console.log('Connected to Redis');
})

redis.on('error', (err) => {
    throw new Error(`Redis connection error: ${err.message}`);
})

export default redis;