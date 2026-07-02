import express, { Router } from 'express';
import * as foodController from '../../controllers/food.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validateAddFoodRequest, validateUpdateFoodRequest } from '../../middleware/validation';
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
foodroutes.get('/', requireAuth, foodController.getFoodItems);
foodroutes.get('/partners/:id', foodController.GetfoodById);
foodroutes.patch('/:foodId', requirePartner, (req, _res, next) => {
	req.body = req.body || {};
	req.body.foodId = req.params.foodId;
	next();
}, validateUpdateFoodRequest, foodController.updateFoodItem);
foodroutes.delete('/:foodId', requirePartner, (req, _res, next) => {
	req.body = req.body || {};
	req.body.foodId = req.params.foodId;
	next();
}, foodController.deleteFoodItem);

export default foodroutes;