import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import {
  getSiteSettings,
  updateHeroSettings,
  updateGallerySettings,
  updateBrandingSettings,
  uploadSiteAsset,
  deleteSiteAsset,
} from '../../controllers/admin/siteSettings.admin.controller.js';

const siteSettingsAdminRouter = express.Router();

/**
 * Site Settings Management Routes
 * All routes are protected with admin authentication
 */

// @route   GET /api/admin/site-settings
// @desc    Get current site settings
// @access  Admin only
siteSettingsAdminRouter.get('/', checkAuth, requireAdmin, getSiteSettings);

// @route   PATCH /api/admin/site-settings/hero
// @desc    Update hero section settings
// @access  Admin only
siteSettingsAdminRouter.patch('/hero', checkAuth, requireAdmin, updateHeroSettings);

// @route   PATCH /api/admin/site-settings/gallery
// @desc    Update gallery section settings
// @access  Admin only
siteSettingsAdminRouter.patch('/gallery', checkAuth, requireAdmin, updateGallerySettings);

// @route   PATCH /api/admin/site-settings/branding
// @desc    Update branding settings (logos)
// @access  Admin only
siteSettingsAdminRouter.patch('/branding', checkAuth, requireAdmin, updateBrandingSettings);

// @route   POST /api/admin/site-settings/upload
// @desc    Upload an image for site settings
// @access  Admin only
siteSettingsAdminRouter.post('/upload', checkAuth, requireAdmin, uploadSiteAsset);

// @route   DELETE /api/admin/site-settings/asset/:publicId
// @desc    Delete an image from site settings
// @access  Admin only
siteSettingsAdminRouter.delete('/asset/:publicId', checkAuth, requireAdmin, deleteSiteAsset);

export default siteSettingsAdminRouter;
