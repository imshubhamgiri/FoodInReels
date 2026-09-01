import mongoose from 'mongoose';
import 'dotenv/config';

async function runBenchmark() {
  process.env.IMAGEKIT_PUBLIC_KEY ||= 'benchmark_public_key';
  process.env.IMAGEKIT_PRIVATE_KEY ||= 'benchmark_private_key';
  process.env.IMAGEKIT_URL_ENDPOINT ||= 'https://ik.imagekit.io/benchmark';

  const { getFoodItems } = await import('../services/food.service.js');

  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodinreels');
  
  const testUserId = '6a7b471d822020c98996548b';
  const runs = 100;
  const timings: number[] = [];

  // Warm-up runs to prime WiredTiger cache and connection pool
  for (let i = 0; i < 20; i++) {
    await getFoodItems(testUserId, 10, undefined, undefined, 'standard');
  }

  // Measured runs
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    await getFoodItems(testUserId, 10, undefined, undefined, 'standard');
    timings.push(performance.now() - start);
  }

  timings.sort((a, b) => a - b);
  const p50 = timings[Math.floor(runs * 0.5)].toFixed(2);
  const p95 = timings[Math.floor(runs * 0.95)].toFixed(2);

  console.log(`Results over ${runs} runs:`);
  console.log(`p50 Latency: ${p50} ms`);
  console.log(`p95 Latency: ${p95} ms`);

  await mongoose.disconnect();
  process.exit(0);
}

runBenchmark();