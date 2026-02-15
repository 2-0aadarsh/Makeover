import express from 'express';
import { checkAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import { getAllContactMessages } from '../../controllers/admin/contactMessage.admin.controller.js';

const contactMessageAdminRouter = express.Router();

// @route   GET /api/admin/contact-messages
// @desc    Get all contact us messages with search and pagination
// @access  Admin only
// @query   page, limit, search, sortBy, sortOrder
contactMessageAdminRouter.get('/', checkAuth, requireAdmin, getAllContactMessages);

export default contactMessageAdminRouter;
