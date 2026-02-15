import express from 'express';
import { submitCityRequest, getSuggestedCityByIP } from '../controllers/cityRequest.controller.js';
import { optionalAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/suggest-city', getSuggestedCityByIP);
router.post('/', optionalAuth, submitCityRequest);

export default router;
