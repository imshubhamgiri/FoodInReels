import express, { Router } from 'express';
import * as foodController from '../../controllers/food.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateAddFoodRequest, validateUpdateFoodRequest } from '../../middleware/validation';
import multer from 'multer';

const foodroutes: Router = express.Router();
const storage = multer.memoryStorage(); // IMPORTANT!
const upload = multer({ storage: storage });
const requirePartner = [requireAuth, requireRole(['partner'])];

// Backward-compatible aliases (specific routes FIRST to avoid conflicts)
foodroutes.post('/add', requirePartner, upload.single('media'), validateAddFoodRequest, foodController.addFoodItem);
foodroutes.get('/listfood', requireAuth, foodController.getFoodItems);
foodroutes.get('/getfood/:id', foodController.GetfoodById);
foodroutes.put('/update', requirePartner, validateUpdateFoodRequest, foodController.updateFoodItem);
foodroutes.delete('/delete', requirePartner, foodController.deleteFoodItem);

export default foodroutes;