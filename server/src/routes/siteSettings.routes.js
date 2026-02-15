import express from 'express';
import { getPublicSiteSettings } from '../controllers/siteSettings.controller.js';

const siteSettingsRouter = express.Router();

/**
 * Public Site Settings Routes
 * Used by frontend to fetch site settings
 */

// @route   GET /api/site-settings
// @desc    Get current site settings (public)
// @access  Public
siteSettingsRouter.get('/', getPublicSiteSettings);

export default siteSettingsRouter;
