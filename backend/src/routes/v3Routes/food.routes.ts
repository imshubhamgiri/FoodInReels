import express, { Router } from 'express';
import * as foodController from '../../controllers/food.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateAddFoodRequest } from '../../middleware/validation';
import multer from 'multer';

const foodroutes: Router = express.Router();
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage ,
	limits:{
		fileSize: 5 * 1024 * 1024 // 5MB limit
	}
 });
const requirePartner = [requireAuth, requireRole(['partner'])];

// Refined routes (generic routes LAST)
foodroutes.post('/', requirePartner, upload.single('media'), validateAddFoodRequest, foodController.uploadFoodMediaInBackground);

export default foodroutes;