import express from 'express';
import { validateOnboardingToken, completeOnboarding } from '../../controllers/admin/admin.admin.controller.js';

const onboardingRouter = express.Router();

/**
 * Public onboarding routes (token-based authentication, no JWT required)
 */

// @route   GET /api/admin/onboard
// @desc    Validate onboarding token and return admin details
// @access  Public (token-based)
// @query   token
onboardingRouter.get('/', validateOnboardingToken);

// @route   POST /api/admin/onboard
// @desc    Complete admin onboarding (set password, verify email)
// @access  Public (token-based)
// @body    { token, password, confirmPassword }
onboardingRouter.post('/', completeOnboarding);

export default onboardingRouter;
