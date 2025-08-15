import express from "express";

import { signupController, validateOtpController } from "../controllers/auth.contoller.js";
import { validateSignup } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

// Example route for user registration
authRouter.post("/register", validateSignup, signupController );
authRouter.post("/register/verify-otp", validateOtpController );


// Example route for user login
authRouter.post("/login", (req, res) => {   
  const { username, password } = req.body;
  // Here you would typically handle user authentication logic
  if (username && password) {
    res.status(200).json({ message: "User logged in successfully", user: { username } });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

// Example route for user logout
authRouter.post("/logout", (req, res) => {
  // Here you would typically handle user logout logic
  res.status(200).json({ message: "User logged out successfully" });
});

// Export the authRouter to be used in the main server file
export default authRouter;