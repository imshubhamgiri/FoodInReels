import mongoose, { Types } from 'mongoose';
import Food from '../models/food.model';
import { FoodPartner, IFoodPartner } from '../models/foodPartner.model';
import Like from '../models/like.model';
import Save from '../models/save.model';
import User from '../models/userModel';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodinreels';

// Replace these with the real Cloudinary URLs generated after uploading 3-5 items via your app
const REAL_REELS = [
  {
    video: 'https://res.cloudinary.com/your-cloud-name/video/upload/v1234567/reels/reel_1.mp4',
    videoPublicId: 'reels/reel_1',
  },
  {
    video: 'https://res.cloudinary.com/your-cloud-name/video/upload/v1234567/reels/reel_2.mp4',
    videoPublicId: 'reels/reel_2',
  },
  {
    video: 'https://res.cloudinary.com/your-cloud-name/video/upload/v1234567/reels/reel_3.mp4',
    videoPublicId: 'reels/reel_3',
  },
];

const REAL_IMAGES = [
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', // Burger
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', // Pizza
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500', // Salad
];

async function seedDatabase() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  // 1. Get or create a sample FoodPartner and User
  const samplePartner: Partial<IFoodPartner> = {
    name: 'david',
    email: 'david@gmail.com',
    address: 'NY',
    restaurantName: 'rcFfood',
    password: 'pass123',
    phone: '1011100139',
  };

  let partner = await FoodPartner.findOne();
  if (!partner) {
    partner = await FoodPartner.create(samplePartner);
  }

  let testUser = await User.findOne();
  if (!testUser) {
    testUser = await User.create({
      name: 'Test Benchmarker',
      email: 'test@example.com',
      password: 'pass123',
    });
  }

  const partnerId = partner._id;
  const userId = testUser._id;

  const TOTAL_FOODS = 100000;
  const BATCH_SIZE = 5000;
  const createdFoodIds: Types.ObjectId[] = [];

  console.log(`Starting insertion of ${TOTAL_FOODS} food items...`);
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_FOODS; i += BATCH_SIZE) {
    const batch: any[] = [];
    
    for (let j = 0; j < BATCH_SIZE; j++) {
      const index = i + j;
      const isReel = index % 2 === 0;

      // Stagger createdAt dates across the past 180 days for realistic cursor sorting
      const randomDaysAgo = Math.floor(Math.random() * 180);
      const createdAt = new Date(Date.now() - randomDaysAgo * 86400000 - j * 1000);

      // Cycle through our real asset pools
      const reelAsset = REAL_REELS[index % REAL_REELS.length];
      const imageAsset = REAL_IMAGES[index % REAL_IMAGES.length];

      batch.push({
        name: `Food Item ${index}`,
        description: `Delicious auto-generated food item #${index}`,
        price: Math.floor(Math.random() * 50) + 5,
        type: isReel ? 'reel' : 'standard',
        uploadStatus: 'completed',
        
        // Assign media based on type using modular math to cycle assets
        video: isReel ? reelAsset.video : undefined,
        videoPublicId: isReel ? reelAsset.videoPublicId : undefined,
        image: !isReel ? imageAsset : undefined,

        likeCount: Math.floor(Math.random() * 100),
        saveCount: Math.floor(Math.random() * 50),
        foodPartner: partnerId,
        createdAt,
        updatedAt: createdAt,
      });
    }

    const inserted = await Food.insertMany(batch, { ordered: false });
    
    // Store subset of IDs to generate user likes and saves
    if (createdFoodIds.length < 2000) {
      inserted.forEach((doc) => createdFoodIds.push(doc._id as Types.ObjectId));
    }
    
    console.log(`Inserted ${i + batch.length} / ${TOTAL_FOODS} documents...`);
  }

  // 2. Seed Likes and Saves for the test user
  console.log('Seeding likes and saves for test user...');
  const likesToInsert = createdFoodIds.slice(0, 500).map((foodId) => ({
    userId,
    food: foodId,
  }));
  
  const savesToInsert = createdFoodIds.slice(250, 750).map((foodId) => ({
    userId,
    food: foodId,
  }));

  await Like.insertMany(likesToInsert, { ordered: false });
  await Save.insertMany(savesToInsert, { ordered: false });

  console.log(`Seeding complete in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
  console.log(`Test User ID for benchmarking: ${userId.toString()}`);

  await mongoose.disconnect();
}

seedDatabase().catch(console.error);