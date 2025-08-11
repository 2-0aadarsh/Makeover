import express from "express";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream

import { signupController, validateOtpController } from "../controllers/auth.contoller.js";
import { validateSignup } from "../middlewares/auth.middleware.js";
=======
import { User } from "../models/user.model.js";
>>>>>>> Stashed changes
=======
import { User } from "../models/user.model.js";
>>>>>>> Stashed changes
=======
import { User } from "../models/user.model.js";
>>>>>>> Stashed changes
=======
import { User } from "../models/user.model.js";
>>>>>>> Stashed changes

const authRouter = express.Router();

// Example route for user registration
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
authRouter.post("/register", validateSignup, signupController );
authRouter.post("/register/verify-otp", validateOtpController );
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
authRouter.post("/register", async (req, res) => {
  console.log('Received registration request:', req.body);
  const { name, email, phoneNumber, password, confirmPassword } = req.body;
  
  // Here you would typically handle user registration logic
  if (!name || !email || !phoneNumber || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Simulate user registration success
  if( password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  } 

  try {
    // check user already exists in the database
    const existingUser = await User.findOne({ email }); // Simulate checking the database
    
    // if exists, return an error
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // else, save the user to the database
    const newUser =  await User.create({ name, email, phoneNumber, password });

    // In a real application, you would save the user to a database here
    console.log(`User registered: ${ newUser }`);
    // Respond with a success message
    return res.status(201).json({ newUser});
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
  
});
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes


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