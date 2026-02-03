import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  getAllCityRequests,
  getCityRequestAnalytics,
  updateCityRequestStatus,
  addRequestToServiceable,
} from '../../controllers/admin/cityRequest.admin.controller.js';

const router = express.Router();

router.get('/analytics', checkAuth, requireAdmin, getCityRequestAnalytics);
router.get('/', checkAuth, requireAdmin, getAllCityRequests);
router.patch('/:id/status', checkAuth, requireAdmin, updateCityRequestStatus);
router.post('/:id/add-to-serviceable', checkAuth, requireAdmin, addRequestToServiceable);

export default router;
