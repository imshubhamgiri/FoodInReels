// import type { FoodItemWithStatus } from '../types';
import * as foodRepository from '../repositories/food.repository';
import { ValidationError, NotFoundError, ForbiddenError } from '../utils/error';
import food from '../models/food.model';
import storageService from '../service/storage.service';
import type { File } from '../types';
import { videoUploadQueue } from '../config/queue.config';
import { v4 as uuid } from 'uuid';

interface uploadFood{
    name: string,
    description: string,
    price: number,
    type: 'standard' | 'reel',
    foodPartner: string,
    image?:string,
    video?:string,
    videoPublicId?:string
}

type InitialFoodFields = Omit<uploadFood, 'foodPartner' | 'image' | 'video' | 'videoPublicId'>;


export const getFoodItems = async (
  userId?: string,
  limit?: number,
  lastPartner?: string,
  lastCreatedAt?: string
) => {
  return foodRepository.getFoodItemsWithUserState(
    userId,
    limit || 2,
    lastPartner,
    lastCreatedAt
  );
};

// const addFoodItem = async (foodData: any, userId: string): Promise<any> => {
//   if (!userId) {
//     throw new ValidationError('User ID is required to add a food item');
//   }
//   return foodRepository.addFoodItem(foodData, userId);
// };

export const getFoodByPartnerId = async (partnerId: string): Promise<any[]> => {
  if (!partnerId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid partner ID format');
  }

  const foodItems = await food.find({ foodPartner: partnerId });
  return foodItems;
};

export const deleteFoodItem = async (foodId: string, userId: string): Promise<void> => {
  if (!foodId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid food ID format');
  }

  const fooditem = await foodRepository.findById(foodId);

  if (!fooditem) {
    throw new NotFoundError('Food item not found');
  }

  if (fooditem.foodPartner.toString() !== userId) {
    throw new ForbiddenError('You can only delete your own food items');
  }

  if (fooditem.videoPublicId) {
    await storageService.deleteVideo(fooditem.videoPublicId);
  }

  await foodRepository.deleteFoodItem(foodId);
};

export const updateFoodItem = async (foodId: string, userId: string, updateData: any) => {
  await checkFoodOwnership(foodId, userId);
  return await foodRepository.updateFoodItem(foodId, updateData);
};

export const addFoodItem = async (data: InitialFoodFields, file: File, foodPartnerId: string) => {
  const imageUploadResponse = await storageService.uploadVideo(file);

  const foodData: uploadFood = {
    name: data.name,
    description: data.description,
    price: data.price,
    type: data.type,
    foodPartner: foodPartnerId,
  };

  if (data.type === 'standard') {
    foodData.image = imageUploadResponse.url;
  } else {
    foodData.video = imageUploadResponse.url;
    foodData.videoPublicId = imageUploadResponse.fileId;
  }

  return await foodRepository.addFoodItem(foodData);
};


export const enqueueBackgroundUpload = async (data:InitialFoodFields , foodPartnerId:string, file: File) =>{
  const foodData: uploadFood = {
    name: data.name,
    description: data.description,
    price: data.price,
    type: data.type,
    foodPartner: foodPartnerId,
    // We can add a field to your schema like uploadStatus: 'processing' if desired, 
    // or just leave video/image blank to signify it's pending.
  };

  console.log('Creating pending food item for partner:', foodPartnerId, 'with type:', data.type);
  const pendingItem = await foodRepository.addFoodItem(foodData);

  await videoUploadQueue.add('uploadJob', {
    partnerId: foodPartnerId,
    foodItemId: pendingItem._id,
    type: data.type,
    file: {
      fileBuffer: file.fileBuffer.toString('base64'),
      fileName: uuid(),
      mimeType: file.mimeType
    }
  });

  return pendingItem;
}

export const processBackgroundUpload = async (foodItemId: string, file: File, type: 'standard' | 'reel') => {
  // Execute your exact existing ImageKit upload logic cleanly
  console.log('Starting background upload for food item:', foodItemId, 'with type:', type)

  const imageUploadResponse = await storageService.uploadVideo(file);

  console.log('Upload response received:', imageUploadResponse.name, imageUploadResponse.url, imageUploadResponse.fileId);

  const updateData: Partial<uploadFood> = {};
  if (type === 'standard') {
    updateData.image = imageUploadResponse.url;
  } else {
    updateData.video = imageUploadResponse.url;
    updateData.videoPublicId = imageUploadResponse.fileId;
  }

  // Update the document via your repository
  return await foodRepository.updateFoodItem(foodItemId, updateData);
};



export const checkFoodOwnership = async (foodId: string, userId: string): Promise<any> => {
  if (!foodId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid food ID format');
  }

  const fooditem = await food.findById(foodId);

  if (!fooditem) {
    throw new NotFoundError('Food item not found');
  }

  if (fooditem.foodPartner.toString() !== userId) {
    throw new ForbiddenError('You can only update your own food items');
  }

  return fooditem;
};
