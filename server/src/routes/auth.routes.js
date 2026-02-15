import express from "express";

import { forgotPasswordController, googleLoginController, completeGoogleSignupController, loginController, logoutController, resetPasswordController, signupController, validateOtpController, checkStatusController } from "../controllers/auth.contoller.js";
import { checkAuth, validateLogin, validateSignup } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

// Route for user registration
authRouter.post("/register", validateSignup, signupController );
authRouter.post("/register/verify-otp", validateOtpController );


// Route for user login
authRouter.post("/login", validateLogin, loginController);

// Route for Google OAuth login
authRouter.post("/google", googleLoginController);

// Route for completing Google signup with phone number
authRouter.post("/google/complete", completeGoogleSignupController);

// Route for user logout
authRouter.post("/logout", logoutController);


// Check Logged-in State
authRouter.get('/status', checkAuth, checkStatusController);

// Route for user forget password
authRouter.post("/forget-password", forgotPasswordController);
authRouter.post("/reset-password/:id/:token", resetPasswordController);

// Export the authRouter to be used in the main server file
export default authRouter;