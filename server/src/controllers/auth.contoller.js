import 'dotenv/config';
import { sendEmailVerification } from '../services/email.service.js';
import { signup } from "../services/auth.service.js";
import { generateOtp } from '../services/otp.service.js';
import { deleteCache, getCache, setCache } from '../uitils/redis/redis.utils.js';
import { User } from '../models/user.model.js';
import { setAuthAccessCookie, setAuthRefreshCookie } from '../uitils/cookies/cookie.utils.js';
import { generateAccessToken, generateRefreshToken } from '../uitils/tokens/jwt.utils.js';

const signupController = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    // check if phone number already exists
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {  
      return res.status(400).json({ message: "User already exists with this phone number" });
    }


    // Call the OTP service to generate OTP for sending over email for verification
    const otp = generateOtp();

    // call the redis service to store the OTP with email as key
    setCache(email, otp, 300); // Store OTP for 5 minutes
    
    // Call the email service to handle email sending for verification
    const emailContent = {
      username: name,
      appName: process.env.APP_NAME,
      otp: otp, 
    };


    // Here you would typically call the email service to send a verification email
    await sendEmailVerification(email, 'Email Verification', emailContent);
    
    // proceed with signup and save user details and isVerifed as false
    const newUser = await signup({ name, email, phoneNumber, password });
    
    // Respond to the client indicating that the verification email has been sent
    return res.status(201).json({ message: "Verification email sent successfully. Please check your inbox." });
    

  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

const validateOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the OTP is valid
    const cachedOtp = await getCache(email);

    if (!cachedOtp) {
      return res.status(400).json({ message: "Time limit exceed. Expired OTP" });
    }

    if (cachedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user as verified
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { isVerfied: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token
    const accessToken = generateAccessToken({ userId: updatedUser._id });
    const refreshToken = generateRefreshToken({ userId: updatedUser._id });

    // Set cookie
    setAuthAccessCookie(res, accessToken);
    setAuthRefreshCookie(res, refreshToken);

    // Clear the OTP from cache after successful verification
    await deleteCache(email);

    // Respond
    return res.status(200).json({
      message: "Email verified successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
      },
    });

    
  } catch (error) {
    console.error("Error validating OTP:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}



export { signupController, validateOtpController };