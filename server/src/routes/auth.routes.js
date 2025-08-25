import express from "express";

import { forgotPasswordController, loginController, logoutController, resetPasswordController, signupController, validateOtpController } from "../controllers/auth.contoller.js";
import { checkAuth, validateLogin, validateSignup } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

// Route for user registration
authRouter.post("/register", validateSignup, signupController );
authRouter.post("/register/verify-otp", validateOtpController );


// Route for user login
authRouter.post("/login", validateLogin, loginController);

// Route for user logout
authRouter.post("/logout", logoutController);


// Check Logged-in State
authRouter.get('/status', checkAuth, (req,res)=>{
  res.json({ success : true, loggedIn: true, user: req.user });
})

// Route for user forget password
authRouter.post("/forget-password", forgotPasswordController);
authRouter.post("/reset-password/:id/:token", resetPasswordController);

// Export the authRouter to be used in the main server file
export default authRouter;