import 'dotenv/config';
import jwt from "jsonwebtoken";

import { sendEmailVerification, sendForgetPassword } from '../services/email.service.js';
import { login, signup } from "../services/auth.service.js";
import { generateOtp } from '../services/otp.service.js';
import { deleteCache, getCache, setCache } from '../uitils/redis/redis.utils.js';
import { User } from '../models/user.model.js';
import { setAuthAccessCookie, setAuthRefreshCookie } from '../uitils/cookies/cookie.utils.js';
import { generateAccessToken, generateRefreshToken, generateToken } from '../uitils/tokens/jwt.utils.js';

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

    const cachedOtp = await getCache(email);
    console.log(cachedOtp)
    
    if (!cachedOtp) {
      return res.status(400).json({ message: "Time limit exceed. Expired OTP" });
    }

    if (String(cachedOtp) !== String(otp)) {
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

    const payload = {
      id: updatedUser._id,
      name : updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      name : updatedUser.name
    };

    // Generate JWT token
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set cookie
    setAuthAccessCookie(res, accessToken);
    setAuthRefreshCookie(res, refreshToken);

    // Clear the OTP from cache after successful verification
    await deleteCache(email);

    // Respond
    return res.status(200).json({
      success : true,
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

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await login(email);
    if (!user) {
      return res.status(401).json({ success : false,  message: "Invalid Email, user doesn't exists" });
    }

    // 2. Check if verified
    if (!user.isVerfied) {
      return res.status(403).json({ success : false, message: "Please verify your email before logging in" });
    }

    // 2.5. Check if admin is active (only for admin users)
    if (user.role === 'admin' && user.isActive === false) {
      return res.status(403).json({ 
        success: false, 
        message: "Your admin account has been deactivated. Please contact the system administrator." 
      });
    }

    // 3. Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success : false, message: "Invalid password," });
    }

    // 4. Generate payload for the tokens
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      name : user.name
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 5. Set cookies
    setAuthAccessCookie(res, accessToken);
    setAuthRefreshCookie(res, refreshToken);

    // 6. Response
    return res.status(200).json({
      success : true, 
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role, // Include role for frontend routing
      },
    });

  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const logoutController = async(req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    // Optionally: add token to blacklist (if using JWT with blacklist/whitelist logic)
    // if (accessToken) {
      // Example: save it to a Redis blacklist until it expires
      // await redis.set(`bl_${accessToken}`, true, "EX", tokenExpiryTime);
    // }

    // if (refreshToken) {
      // Same for refresh token
      // await redis.set(`bl_${refreshToken}`, true, "EX", refreshExpiryTime);
    // }

    // Clear cookies safely
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure only in prod
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      error : "Error occured during loggin out",
      message: error.message,
    });
  }
}

// const forgotPasswordController = async(req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     // 1. Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       // Do NOT reveal that the email doesn't exist -> security best practice
//       return res.status(200).json({
//         success: true,
//         message: "If the account exists, an OTP has been sent to the registered email.",
//       });
//     }

//     // 2. Generate OTP
//     const otp = generateOtp();

//     // 3. Store OTP in Redis with expiry (5 mins)
//     await setCache(`reset:${email}`, otp, 300);

//     // 4. Send email with OTP
//     const emailContent = {
//       username: user.name,
//       appName: process.env.APP_NAME,
//       token : otp,
//     };

//     await sendForgetPassword(
//       email,
//       "Password Reset Request",
//       emailContent
//     );

//     // 5. Response
//     return res.status(200).json({
//       success: true,
//       message:
//         "If the account exists, an OTP has been sent to the registered email.",
//     });



//   } catch (error) {
//     console.error("Error in forgotPasswordController:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// }


const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Do NOT reveal existence
      return res.status(200).json({
        success: true,
        message: "If the account exists, a password reset link has been sent.",
      });
    }

    // 2. Generate short-lived JWT reset token
    const tokenPayload = { id : user._id }
    const resetToken = generateToken(tokenPayload, "15m")

    // 2.5: Store token in Redis (so we can invalidate after use)
    await setCache(`resetToken:${user._id}`, resetToken, 900); // 15 min

    // 3. Construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${user._id}/${resetToken}`;

    // 4. Send email
    const emailContent = {
      username: user.name,
      appName: process.env.APP_NAME,
      url: resetUrl,
    };

    await sendForgetPassword(
      email,
      "Password Reset Request",
      emailContent
    );

    // 5. Response
    return res.status(200).json({
      success: true,
      message: "A password reset link has been sent to your email.",
    });

  } catch (error) {
    console.error("Error in forgotPasswordController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const resetPasswordController = async (req, res) => {
  try {
   const { id, token } = req.params;
    console.log(token)
    const { password, confirmPassword } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    if (!confirmPassword) {
      return res.status(400).json({ success: false, message: "confirmPassword is required" });
    }

    if(confirmPassword !== password) {
      return res.status(400).json({ success: false, message: "password and confirmPassword do not match" });
    }

    // 2. Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      
    } catch (err) {
      return res.status(400).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Reset link has expired. Please request a new one."
            : "Invalid reset link",
      });
    }

    const userId = decoded.id;

    // 2. Check Redis for token existence
    const cachedToken = await getCache(`resetToken:${userId}`);
    if (!cachedToken || cachedToken !== token) {
      return res.status(400).json({ success: false, message: "Reset token already used or invalid" });
    }

    // 3. Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 4. Update password (pre-save hook will hash + update passwordChangedAt)
    user.password = password;
    await user.save();

    // 5. Delete reset token from Redis (one-time use)
    await deleteCache(`resetToken:${userId}`);

    // 6. Generate new access & refresh tokens
    const payload = { id: user._id, name : user.name, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 7. Set cookies
    setAuthAccessCookie(res, accessToken);
    setAuthRefreshCookie(res, refreshToken);
    
    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You are now logged in.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });    

  } catch (error) {
     console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error : error.message
    });
  }
};

// Check authentication status and return full user data
const checkStatusController = async (req, res) => {
  try {
    // req.user comes from checkAuth middleware (contains JWT payload: id, name, email, role)
    const userId = req.user.id;

    // Fetch the complete user data from database to get phoneNumber
    const user = await User.findById(userId).select('-password -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        loggedIn: false,
        message: "User not found"
      });
    }

    // Return full user data including phoneNumber
    return res.status(200).json({
      success: true,
      loggedIn: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Error checking status:", error);
    return res.status(500).json({
      success: false,
      loggedIn: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const googleLoginController = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: "Authorization code is required" 
      });
    }

    // Import Google OAuth client
    const { OAuth2Client } = await import('google-auth-library');
    
    // Get Google OAuth credentials from environment
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error("Google OAuth credentials not configured");
      return res.status(500).json({ 
        success: false, 
        message: "Google OAuth not configured on server" 
      });
    }

    const client = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    let ticket;
    try {
      // Exchange authorization code for tokens
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      // Verify the ID token and get user info
      ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      console.error("Google OAuth error:", error);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid or expired authorization code" 
      });
    }

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email not provided by Google" 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (user) {
      // User exists - update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerfied = true; // Mark as verified
        await user.save();
      }
    } else {
      // Create new user for Google OAuth (without phoneNumber initially)
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        phoneNumber: null, // Will be collected before completing login
        password: undefined, // No password for Google OAuth users
        isVerfied: true, // Google users are automatically verified
        role: "user", // Default role
      });
    }

    // Check if phone number is required
    if (!user.phoneNumber) {
      // Phone number is missing - return flag to collect it
      return res.status(200).json({
        success: true,
        phoneNumberRequired: true,
        message: "Phone number is required to complete signup",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: null,
          role: user.role,
        },
      });
    }

    // Phone number exists - proceed with login
    // Generate JWT tokens
    const tokenPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Set cookies
    setAuthAccessCookie(res, accessToken);
    setAuthRefreshCookie(res, refreshToken);

    // Return response (same format as regular login)
    return res.status(200).json({
      success: true,
      phoneNumberRequired: false,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Error in Google login:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error", 
      error: error.message 
    });
  }
};

const completeGoogleSignupController = async (req, res) => {
  try {
    const { userId, phoneNumber, password, confirmPassword } = req.body;

    if (!userId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "User ID and phone number are required",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required",
      });
    }

    // Validate phone number format (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits starting with 6, 7, 8, or 9",
      });
    }

    // Validate password format (same as regular signup)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with uppercase, number, and special character",
      });
    }

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has googleId (Google OAuth user)
    if (!user.googleId) {
      return res.status(400).json({
        success: false,
        message: "This endpoint is only for Google OAuth users",
      });
    }

    // Check if phone number already exists (unique constraint)
    const existingPhone = await User.findOne({
      phoneNumber,
      _id: { $ne: userId },
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    // Update user with phone number and password
    user.phoneNumber = phoneNumber;
    user.password = password; // Password will be hashed by the pre-save hook
    await user.save();

    // Generate JWT tokens
    const tokenPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Set cookies
    setAuthAccessCookie(res, accessToken);
    setAuthRefreshCookie(res, refreshToken);

    // Return response
    return res.status(200).json({
      success: true,
      message: "Signup completed successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error completing Google signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { signupController, validateOtpController, loginController, logoutController, forgotPasswordController, resetPasswordController, checkStatusController, googleLoginController, completeGoogleSignupController };