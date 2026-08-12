import { PipelineStage } from 'mongoose';
import Food from '../models/food.model';
import type { FoodItemWithStatus, IFood } from '../types';
import { Types } from 'mongoose';
import Save from '../models/save.model';
import Like from '../models/like.model';
import { FoodPartner } from '../models/foodPartner.model';

type FoodDbItem = Omit<IFood, '_id' | 'foodPartner'> & {
  _id: Types.ObjectId;
  foodPartner: Types.ObjectId;
};

type FoodRelationItem = {
  food: Types.ObjectId;
};

type FoodPartnerItem = {
  _id: Types.ObjectId;
  restaurantName: string;
};

export const getFoodItemsWithUserState = async (
  userId: string | undefined,
  limit: number = 2,
  id?: string,
  lastCreatedAt?: string,
  type: 'standard' | 'reel' = 'standard'
): Promise<{
  foods: FoodItemWithStatus[];
  total: number;
  nextCursor: { id: string; lastCreatedAt: string } | null;
  hasMore: boolean;

}> => {
  // CURSOR FILTER
  let cursorMatch: any = {};
  cursorMatch.$and = [{ uploadStatus: 'completed' , type }];
  if (id && lastCreatedAt) {
    // Convert id string to ObjectId 
    const cursorId = new Types.ObjectId(id);

    // For cursor pagination: get docs with createdAt < lastCreatedAt
    // Also exclude the current doc by using _id comparison if timestamps are equal
    cursorMatch = {
      $or: [
        // Docs created before the cursor timestamp (older documents)
        { createdAt: { $lt: new Date(lastCreatedAt) } },
        // Docs created at the same time but with _id < cursor (in case of ties)
        {
          createdAt: new Date(lastCreatedAt),
          _id: { $lt: cursorId },
        },
      ],
    };
  } else if (lastCreatedAt) {
    cursorMatch = { createdAt: { $lt: new Date(lastCreatedAt) } };
  }

  // if (cursorMatch && Object.keys(cursorMatch).length > 0) {
  //   console.log('Cursor match:', JSON.stringify(cursorMatch, null, 2));
  // } else {
  //   console.log('No cursor filter applied - fetching from start');
  // }
  //  to detect if more results exist
  const fetchLimit = limit + 1;

  const pipeline: PipelineStage[] = [
    // 1️ FILTER by cursor
    { $match: cursorMatch },

    // 2️⃣ SORT - must match cursor field order for consistency
    { $sort: { createdAt: -1, _id: -1 } },

    // 3️ USE $FACET to get both data AND total count
    {
      $facet: {
        // BRANCH 1: Get paginated data with enrichment
        data: [
          { $limit: fetchLimit },

          // Get foodPartner details
          {
            $lookup: {
              from: 'foodpartners',
              localField: 'foodPartner',
              foreignField: '_id',
              as: 'foodPartnerData',
            },
          },
          {
            $unwind: {
              path: '$foodPartnerData',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              foodPartner: {
                _id: '$foodPartner',
                name: '$foodPartnerData.name',
              },
            },
          },
          { $project: { foodPartnerData: 0 } },

          // USER-SPECIFIC DATA if userId provided
          ...(userId
            ? [
              {
                $lookup: {
                  from: 'likes',
                  let: { foodId: '$_id', userId },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$food', '$$foodId'] },
                            { $eq: ['$userId', { $toObjectId: userId }] },
                          ],
                        },
                      },
                    },
                  ],
                  as: 'userLikeData',
                },
              },
              {
                $lookup: {
                  from: 'saves',
                  let: { foodId: '$_id', userId },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$food', '$$foodId'] },
                            { $eq: ['$userId', { $toObjectId: userId }] },
                          ],
                        },
                      },
                    },
                  ],
                  as: 'userSaveData',
                },
              },
              {
                $addFields: {
                  isLiked: { $gt: [{ $size: '$userLikeData' }, 0] },
                  isSaved: { $gt: [{ $size: '$userSaveData' }, 0] },
                },
              },
              {
                $project: {
                  userLikeData: 0,
                  userSaveData: 0,
                },
              },
            ]
            : []),
        ],

        // BRANCH 2: Get total count (before pagination)
        totalCount: [{ $count: 'count' }],
      },
    },
  ];

  //Check performance

  const start = performance.now();

  // Execute aggregation
  const result = await Food.aggregate<{
    data: FoodItemWithStatus[];
    totalCount: Array<{ count: number }>;
  }>(pipeline);

  const duration = (performance.now() - start).toFixed(2);
  console.log(`Mongo Aggregate (${'GET/food'}): ${duration} ms`)

  //  RESULTS
  const foods = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.count || 0;

  //  IF MORE RESULTS EXIST
  const hasMore = foods.length > limit;
  const paginatedFoods = foods.slice(0, limit); // Return only limit items

  // CALCULATE NEXT CURSOR
  const lastItem = paginatedFoods[paginatedFoods.length - 1];
  const nextCursor = lastItem
    ? {
      id: (lastItem._id as Types.ObjectId).toString(),
      lastCreatedAt: lastItem.createdAt.toISOString(),
    }
    : null;


  return {
    foods: paginatedFoods,
    total,
    nextCursor,
    hasMore,
  };
};

export const addFoodItem = async (foodData: any) => {
  const newFood = new Food(foodData);
  return await newFood.save();
};

export const findById = async (foodId: string) => {
  return await Food.findById(foodId);
};

export const deleteFoodItem = async (foodId: string) => {
  return await Food.findByIdAndDelete(foodId);
};

export const updateFoodItem = async (foodId: string, updateData: any) => {
  return await Food.findByIdAndUpdate(foodId, updateData, { new: true });
};

export const getFoodByPartnerId = async (foodPartnerId: string): Promise<IFood[]> => {
  return await Food.find({ partnerId: foodPartnerId , uploadStatus: 'completed' }).lean<IFood[]>();
};

export const getAllFoodItems = async (
  userId: string | undefined,
  limit: number = 5,
  id?: string,
  lastCreatedAt?: string,
  type: 'standard' | 'reel' = 'standard'
): Promise<{
  foods: FoodItemWithStatus[];
  nextCursor: { id: string; lastCreatedAt: string } | null;
  hasMore: boolean;
}> => {
  // CURSOR FILTER with proper $or logic for tie-breaking
  let cursorMatch: Record<string, any> = { type, uploadStatus: 'completed' };

  if (id && lastCreatedAt) {
    const cursorId = new Types.ObjectId(id);
    cursorMatch = {
      $and: [
        { type },
        { uploadStatus: 'completed' },
        {
          $or: [
            { createdAt: { $lt: new Date(lastCreatedAt) } },
            { createdAt: new Date(lastCreatedAt), _id: { $lt: cursorId } },
          ],
        },
      ],
    };
  } else if (lastCreatedAt) {
    cursorMatch.createdAt = { $lt: new Date(lastCreatedAt) };
  }

  const fetchLimit = limit + 1;
  const start = performance.now();

  const foods: FoodDbItem[] = await Food.find(cursorMatch)
    .sort({ createdAt: -1, _id: -1 })
    .limit(fetchLimit)
    .lean<FoodDbItem[]>()
    .exec();

  const hasMore: boolean = foods.length > limit;
  const paginatedFoods: FoodDbItem[] = foods.slice(0, limit);

  const foodPartnerIds: string[] = Array.from(
    new Set(paginatedFoods.map((food) => food.foodPartner.toString()))
  );

  const withPartnerName = (
    food: FoodDbItem,
    foodPartnerNameById: Map<string, string>
  ): Omit<FoodItemWithStatus, 'isLiked' | 'isSaved'> => ({
    ...food,
    foodPartner: {
      _id: food.foodPartner.toString(),
      restaurantName: foodPartnerNameById.get(food.foodPartner.toString()) || '',
    },
  });

  let foodsResult: FoodItemWithStatus[];

  if (userId) {
    const foodItemIds: string[] = paginatedFoods.map((food) => food._id.toString());

    const [likedFoods, savedFoods, foodPartners] = await Promise.all([
      Like.find({ userId: new Types.ObjectId(userId), food: { $in: foodItemIds } })
        .select('food')
        .lean<FoodRelationItem[]>()
        .exec(),
      Save.find({ userId: new Types.ObjectId(userId), food: { $in: foodItemIds } })
        .select('food')
        .lean<FoodRelationItem[]>()
        .exec(),
      FoodPartner.find({ _id: { $in: foodPartnerIds } })
        .select('restaurantName')
        .lean<FoodPartnerItem[]>()
        .exec(),
    ]);

    const likedFoodIds = new Set(likedFoods.map((like) => like.food.toString()));
    const savedFoodIds = new Set(savedFoods.map((save) => save.food.toString()));
    const foodPartnerNameById = new Map(
      foodPartners.map((partner) => [partner._id.toString(), partner.restaurantName])
    );

    foodsResult = paginatedFoods.map((food): FoodItemWithStatus => ({
      ...withPartnerName(food, foodPartnerNameById),
      isLiked: likedFoodIds.has(food._id.toString()),
      isSaved: savedFoodIds.has(food._id.toString()),
    }));
  } else {
    const foodPartners = await FoodPartner.find({ _id: { $in: foodPartnerIds } })
      .select('restaurantName')
      .lean<FoodPartnerItem[]>()
      .exec();

    const foodPartnerNameById = new Map(
      foodPartners.map((partner) => [partner._id.toString(), partner.restaurantName])
    );
  


    foodsResult = paginatedFoods.map((food): FoodItemWithStatus => ({
      ...withPartnerName(food, foodPartnerNameById),
      isLiked: false,
      isSaved: false,
    }));
  }

  const duration = (performance.now() - start).toFixed(2);
  console.log(`Mongo Query (getAllFoodItems - ${type}, userId=${!!userId}): ${duration} ms`);

  const lastItem = foodsResult[foodsResult.length - 1];
  const nextCursor = lastItem
    ? { id: lastItem._id.toString(), lastCreatedAt: lastItem.createdAt.toISOString() }
    : null;

  return { foods: foodsResult, nextCursor, hasMore };
};
