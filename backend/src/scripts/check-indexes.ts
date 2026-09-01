// scripts/check-indexes.ts
import mongoose from 'mongoose';
import Food from '../models/food.model';

async function analyzeQuery() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodinreels');
  
  console.log('Running query analysis...');
  
  const explainResult = await Food.find({ type: 'standard', uploadStatus: 'completed' })
    .sort({ createdAt: -1, _id: -1 })
    .limit(10)
    .explain('executionStats');

  // @ts-ignore - mongoose typing for explain can sometimes be loose
  const stats = explainResult.executionStats;

  console.log('--------------------------------------');
  console.log('Docs Examined (should be ~10):', stats.totalDocsExamined);
  console.log('Keys Examined (should be ~10):', stats.totalKeysExamined);
  console.log('Returned Docs (should be 10):', stats.nReturned);
  console.log('Execution Time (ms):', stats.executionTimeMillis);
  console.log('Index Used:', stats.executionStages?.inputStage?.indexName || 'No index / COLLSCAN');
  console.log('--------------------------------------');

  await mongoose.disconnect();
}

analyzeQuery();