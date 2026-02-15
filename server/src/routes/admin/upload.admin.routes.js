import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  testImageUpload,
  testMultipleImageUpload,
  testImageDelete,
  testCloudinaryConfig
} from '../../controllers/admin/upload.admin.controller.js';

const uploadAdminRouter = express.Router();

/**
 * Test routes for image upload functionality
 * All routes are protected with admin authentication
 */

// @route   GET /api/admin/upload/test-config
// @desc    Test Cloudinary configuration
// @access  Admin only
uploadAdminRouter.get('/test-config', checkAuth, requireAdmin, testCloudinaryConfig);

// @route   POST /api/admin/upload/test
// @desc    Test single image upload
// @access  Admin only
// @body    FormData with 'image' field
uploadAdminRouter.post('/test', checkAuth, requireAdmin, testImageUpload);

// @route   POST /api/admin/upload/multiple
// @desc    Test multiple image upload
// @access  Admin only
// @body    FormData with 'images' field (can be multiple files)
uploadAdminRouter.post('/multiple', checkAuth, requireAdmin, testMultipleImageUpload);

// @route   DELETE /api/admin/upload/:publicId
// @desc    Test image deletion
// @access  Admin only
// @params  publicId - URL-encoded public ID of the image
uploadAdminRouter.delete('/:publicId', checkAuth, requireAdmin, testImageDelete);

export default uploadAdminRouter;
