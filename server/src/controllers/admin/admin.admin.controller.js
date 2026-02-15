import { User } from '../../models/user.model.js';
import mongoose from 'mongoose';
import { 
  generateOnboardingToken, 
  hashOnboardingToken, 
  calculateTokenExpiry,
  validateOnboardingToken as validateToken
} from '../../services/onboardingToken.service.js';
import { sendAdminOnboardingEmail } from '../../services/email.service.js';
import dotenv from 'dotenv';
dotenv.config();


/**
 * @route   GET /api/admin/admins
 * @desc    Get all admins with filters, search, and pagination
 * @access  Admin only
 */
export const getAllAdmins = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const { search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build query
    const query = { role: 'admin' }; // Only get admins

    // Status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        query.isActive = { $ne: false }; // true or undefined
      } else if (status === 'inactive') {
        query.isActive = false;
      }
    }

    // Search filter (name, email)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query - need to select isVerfied explicitly to ensure it's included
    const admins = await User.find(query)
      .select('-password')
      .select('isVerfied') // Explicitly include isVerfied field
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalAdmins = await User.countDocuments(query);

    // Get stats
    const totalActive = await User.countDocuments({ role: 'admin', isActive: { $ne: false } });
    const totalInactive = await User.countDocuments({ role: 'admin', isActive: false });

    const totalPages = Math.ceil(totalAdmins / limit);

    // Format admins
    const formattedAdmins = admins.map((admin) => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      phoneNumber: admin.phoneNumber || 'N/A',
      isActive: admin.isActive !== false, // Default to true if undefined
      isVerified: admin.isVerfied || false,
      createdBy: admin.createdBy ? {
        id: admin.createdBy._id,
        name: admin.createdBy.name,
        email: admin.createdBy.email
      } : null,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      lastLoginAt: admin.lastLoginAt || null
    }));

    return res.status(200).json({
      success: true,
      message: 'Admins retrieved successfully',
      data: {
        admins: formattedAdmins,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalAdmins: totalAdmins,
          limit: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        stats: {
          total: totalAdmins,
          active: totalActive,
          inactive: totalInactive
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/admins/stats
 * @desc    Get admin statistics
 * @access  Admin only
 */
export const getAdminStats = async (req, res) => {
  try {
    const total = await User.countDocuments({ role: 'admin' });
    const active = await User.countDocuments({ role: 'admin', isActive: { $ne: false } });
    const inactive = await User.countDocuments({ role: 'admin', isActive: false });
    
    // Count verified admins: those with isVerfied: true OR those who can login (have password)
    // This handles:
    // 1. New onboarding system: isVerfied: true after completing onboarding
    // 2. Old OTP system: isVerfied: true after OTP verification
    // 3. Legacy admins: might have password but isVerfied not set (can login = verified)
    
    // First, try simple query for isVerfied: true
    let verified = await User.countDocuments({ 
      role: 'admin', 
      isVerfied: true 
    });
    
    // Always check all admins to get accurate count (handles edge cases)
    const allAdmins = await User.find({ role: 'admin' })
      .select('+password isVerfied')
      .lean();
    
    // Debug: Log admin verification status
    console.log('📊 Admin Stats Debug:');
    allAdmins.forEach(admin => {
      console.log(`  - ${admin.email}: isVerfied=${admin.isVerfied}, isVerfiedType=${typeof admin.isVerfied}, hasPassword=${!!admin.password}`);
    });
    
    // Count verified admins: isVerfied: true OR has password (can login = verified)
    verified = allAdmins.filter(admin => {
      // Verified if: isVerfied is explicitly true OR has password (can login)
      const isVerified = admin.isVerfied === true || (admin.password && admin.password.length > 0);
      return isVerified;
    }).length;
    
    console.log(`📊 Verified count: ${verified} out of ${total} total admins (isVerfied:true=${await User.countDocuments({ role: 'admin', isVerfied: true })}, withPassword=${allAdmins.filter(a => a.password && a.password.length > 0).length})`);

    return res.status(200).json({
      success: true,
      message: 'Admin statistics retrieved successfully',
      data: {
        total,
        active,
        inactive,
        verified
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/admins/:id
 * @desc    Get single admin details
 * @access  Admin only
 */
export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin ID'
      });
    }

    const admin = await User.findOne({ _id: id, role: 'admin' })
      .select('-password')
      .populate('createdBy', 'name email')
      .lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Admin details retrieved successfully',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber || 'N/A',
        isActive: admin.isActive !== false,
        isVerified: admin.isVerfied || false,
        createdBy: admin.createdBy ? {
          id: admin.createdBy._id,
          name: admin.createdBy.name,
          email: admin.createdBy.email
        } : null,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        lastLoginAt: admin.lastLoginAt || null
      }
    });
  } catch (error) {
    console.error('Error fetching admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin details',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/admin/admins
 * @desc    Create a new admin
 * @access  Admin only
 */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, confirmPassword } = req.body;
    const creatorId = req.user.id || req.user._id; // Current admin creating the new admin

    // Validation (password not required - will be set during onboarding)
    if (!name || !email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone number are required'
      });
    }

    // Validate phone number format
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Generate secure onboarding token
    const plainToken = generateOnboardingToken();
    const hashedToken = await hashOnboardingToken(plainToken);
    const tokenExpiry = calculateTokenExpiry(48); // 48 hours TTL

    // Create new admin with onboarding token
    // Note: Password is NOT set here - it will be set during onboarding
    // We temporarily set a secure random password to satisfy schema validation
    // This will be replaced during onboarding and user cannot login until onboarding is complete
    const tempPassword = generateOnboardingToken(); // Use secure token as temp password (64 chars)
    const newAdmin = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      password: tempPassword, // Temporary secure password, will be replaced during onboarding
      role: 'admin',
      isActive: true,
      createdBy: creatorId,
      onboardingToken: hashedToken,
      onboardingTokenExpiresAt: tokenExpiry,
      onboardingTokenCreatedAt: new Date(),
      onboardingTokenUsed: false,
      onboardingTokenInvalidated: false
      // isVerfied defaults to false - will be set to true during onboarding
    });

    await newAdmin.save();

    // Get creator details for email
    const creator = await User.findById(creatorId).select('name email').lean();
    const creatorName = creator?.name || 'Admin';

    // Send onboarding email with link
    const onboardingLink = `${process.env.FRONTEND_URL}/admin/onboard?token=${plainToken}`;
    
    try {
      await sendAdminOnboardingEmail({
        email: newAdmin.email,
        adminName: newAdmin.name,
        creatorName: creatorName,
        onboardingLink: onboardingLink,
        expiresInHours: 48
      });
      console.log(`✅ Onboarding email sent to ${newAdmin.email}`);
    } catch (error) {
      console.error(`❌ Failed to send onboarding email to ${newAdmin.email}:`, error);
      // Don't fail admin creation if email fails - admin can resend link later
    }

    // Return admin without password
    const adminResponse = await User.findById(newAdmin._id)
      .select('-password')
      .populate('createdBy', 'name email')
      .lean();

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: adminResponse._id,
        name: adminResponse.name,
        email: adminResponse.email,
        phoneNumber: adminResponse.phoneNumber || 'N/A',
        isActive: adminResponse.isActive !== false,
        isVerified: adminResponse.isVerfied || false,
        createdBy: adminResponse.createdBy ? {
          id: adminResponse.createdBy._id,
          name: adminResponse.createdBy.name,
          email: adminResponse.createdBy.email
        } : null,
        createdAt: adminResponse.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    
    // Handle duplicate key error (email or phoneNumber)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      } else if (field === 'phoneNumber') {
        return res.status(409).json({
          success: false,
          message: 'Phone number already exists'
        });
      }
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create admin'
    });
  }
};

/**
 * @route   PUT /api/admin/admins/:id
 * @desc    Update admin (name, email, isActive)
 * @access  Admin only
 */
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, isActive } = req.body;
    const currentAdminId = req.user.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin ID'
      });
    }

    // Prevent self-update of status
    if (id === currentAdminId.toString() && isActive !== undefined) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own status'
      });
    }

    const admin = await User.findOne({ _id: id, role: 'admin' });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase().trim() !== admin.email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: id }
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
      admin.email = email.toLowerCase().trim();
    }

    // Check if phone number is being changed and if it's already taken
    if (phoneNumber && phoneNumber.trim() !== admin.phoneNumber) {
      // Validate phone number format
      if (!/^[0-9]{10}$/.test(phoneNumber.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must be exactly 10 digits'
        });
      }
      
      const existingUser = await User.findOne({ 
        phoneNumber: phoneNumber.trim(),
        _id: { $ne: id }
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Phone number already exists'
        });
      }
      admin.phoneNumber = phoneNumber.trim();
    }

    // Update fields
    if (name !== undefined) admin.name = name.trim();
    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();

    // Return updated admin
    const updatedAdmin = await User.findById(admin._id)
      .select('-password')
      .populate('createdBy', 'name email')
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: {
        id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        phoneNumber: updatedAdmin.phoneNumber || 'N/A',
        isActive: updatedAdmin.isActive !== false,
        isVerified: updatedAdmin.isVerfied || false,
        createdBy: updatedAdmin.createdBy ? {
          id: updatedAdmin.createdBy._id,
          name: updatedAdmin.createdBy.name,
          email: updatedAdmin.createdBy.email
        } : null,
        updatedAt: updatedAdmin.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      } else if (field === 'phoneNumber') {
        return res.status(409).json({
          success: false,
          message: 'Phone number already exists'
        });
      }
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update admin'
    });
  }
};

/**
 * @route   PATCH /api/admin/admins/:id/password
 * @desc    Reset admin password
 * @access  Admin only
 */
export const resetAdminPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, confirmPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin ID'
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const admin = await User.findOne({ _id: id, role: 'admin' });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update password (will be hashed by pre-save hook)
    admin.password = password;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
};

/**
 * @route   PATCH /api/admin/admins/:id/toggle-status
 * @desc    Toggle admin active/inactive status
 * @access  Admin only
 */
export const toggleAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const currentAdminId = req.user.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin ID'
      });
    }

    // Prevent self-toggle
    if (id === currentAdminId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own status'
      });
    }

    const admin = await User.findOne({ _id: id, role: 'admin' });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if this is the last active admin
    const activeAdminsCount = await User.countDocuments({ 
      role: 'admin', 
      isActive: { $ne: false },
      _id: { $ne: id } // Exclude current admin
    });

    // Toggle status: if currently false, set to true; otherwise set to false
    const currentStatus = admin.isActive !== false; // true if active (true or undefined)
    const newStatus = !currentStatus;
    
    // Prevent deactivating if this is the last active admin
    if (activeAdminsCount === 0 && newStatus === false) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate the last active admin'
      });
    }

    admin.isActive = newStatus;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: `Admin ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: admin._id,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle admin status',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/admin/admins/:id
 * @desc    Delete admin
 * @access  Admin only
 */
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const currentAdminId = req.user.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin ID'
      });
    }

    // Prevent self-deletion
    if (id === currentAdminId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const admin = await User.findOne({ _id: id, role: 'admin' });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if this is the last active admin
    const activeAdminsCount = await User.countDocuments({ 
      role: 'admin', 
      isActive: { $ne: false },
      _id: { $ne: id } // Exclude current admin
    });

    if (activeAdminsCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last active admin'
      });
    }

    // Delete admin
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete admin',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/onboard
 * @desc    Validate onboarding token and return admin details
 * @access  Public (token-based)
 */
export const validateOnboardingToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Onboarding token is required'
      });
    }

    // Find admin with onboarding token (need to select token field)
    // We need to find by matching the token, but tokens are hashed
    // So we need to check all admins with onboarding tokens
    const admins = await User.find({ 
      role: 'admin',
      onboardingToken: { $ne: null },
      onboardingTokenUsed: false,
      onboardingTokenInvalidated: false
    })
      .select('+onboardingToken')
      .lean();

    if (!admins || admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No admin found with valid onboarding token'
      });
    }

    // Try to find matching admin by validating token
    let validAdmin = null;
    for (const admin of admins) {
      const validation = await validateToken(admin, token);
      if (validation.valid) {
        validAdmin = admin;
        break;
      }
    }
    
    if (!validAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired onboarding token'
      });
    }

    // Return admin details (without sensitive info)
    return res.status(200).json({
      success: true,
      message: 'Onboarding token is valid',
      data: {
        id: validAdmin._id,
        name: validAdmin.name,
        email: validAdmin.email
      }
    });
  } catch (error) {
    console.error('Error validating onboarding token:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to validate onboarding token',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/admin/onboard
 * @desc    Complete admin onboarding (set password, verify email)
 * @access  Public (token-based)
 */
export const completeOnboarding = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token, password, and confirm password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find all admins with onboarding tokens to find the matching one
    const admins = await User.find({ 
      role: 'admin',
      onboardingToken: { $ne: null },
      onboardingTokenUsed: false,
      onboardingTokenInvalidated: false
    })
      .select('+onboardingToken');

    if (!admins || admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No admin found with valid onboarding token'
      });
    }

    // Try to find matching admin by validating token
    let validAdmin = null;
    for (const admin of admins) {
      const validation = await validateToken(admin, token);
      if (validation.valid) {
        validAdmin = admin;
        break;
      }
    }
    
    if (!validAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired onboarding token'
      });
    }

    const admin = validAdmin;

    // Update admin: set password, verify email, mark token as used
    admin.password = password; // Will be hashed by pre-save hook
    admin.isVerfied = true;
    admin.onboardingTokenUsed = true;
    admin.onboardingToken = null; // Clear token after use
    admin.onboardingTokenExpiresAt = null;
    
    await admin.save();

    console.log(`✅ Admin onboarding completed for ${admin.email}`);

    return res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully. You can now login.',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete onboarding',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/admins/:id/onboarding-status
 * @desc    Get onboarding status for an admin
 * @access  Admin only
 */
export const getOnboardingStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin ID'
      });
    }

    const admin = await User.findOne({ _id: id, role: 'admin' })
      .select('onboardingTokenExpiresAt onboardingTokenUsed onboardingTokenInvalidated isVerfied createdAt')
      .lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Determine status
    let status = 'completed';
    let message = 'Onboarding completed';
    
    if (!admin.isVerfied) {
      if (admin.onboardingTokenInvalidated) {
        status = 'invalidated';
        message = 'Onboarding link has been invalidated';
      } else if (admin.onboardingTokenUsed) {
        status = 'completed';
        message = 'Onboarding completed';
      } else if (admin.onboardingTokenExpiresAt) {
        const isExpired = new Date() > new Date(admin.onboardingTokenExpiresAt);
        if (isExpired) {
          status = 'expired';
          message = 'Onboarding link has expired';
        } else {
          status = 'pending';
          message = 'Onboarding link is active and pending';
        }
      } else {
        status = 'not_sent';
        message = 'Onboarding link has not been sent';
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Onboarding status retrieved successfully',
      data: {
        status,
        message,
        isVerified: admin.isVerfied || false,
        expiresAt: admin.onboardingTokenExpiresAt || null,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get onboarding status',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/admin/admins/:id/resend-onboarding-link
 * @desc    Resend onboarding link (only if expired or invalidated)
 * @access  Admin only
 */
export const resendOnboardingLink = async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin ID'
      });
    }

    const admin = await User.findOne({ _id: id, role: 'admin' })
      .select('+onboardingToken');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if admin is already verified
    if (admin.isVerfied) {
      return res.status(400).json({
        success: false,
        message: 'Admin is already verified. Onboarding link cannot be resent.'
      });
    }

    // Check if current token is still valid (not expired, not used, not invalidated)
    const hasValidToken = admin.onboardingToken && 
                          !admin.onboardingTokenUsed && 
                          !admin.onboardingTokenInvalidated &&
                          admin.onboardingTokenExpiresAt &&
                          new Date() < new Date(admin.onboardingTokenExpiresAt);

    if (hasValidToken) {
      return res.status(400).json({
        success: false,
        message: 'A valid onboarding link already exists. You can invalidate it first if needed.'
      });
    }

    // Generate new token
    const plainToken = generateOnboardingToken();
    const hashedToken = await hashOnboardingToken(plainToken);
    const tokenExpiry = calculateTokenExpiry(48);

    // Update admin with new token
    admin.onboardingToken = hashedToken;
    admin.onboardingTokenExpiresAt = tokenExpiry;
    admin.onboardingTokenCreatedAt = new Date();
    admin.onboardingTokenUsed = false;
    admin.onboardingTokenInvalidated = false;

    await admin.save();

    // Get creator details
    const creator = await User.findById(creatorId).select('name email').lean();
    const creatorName = creator?.name || 'Admin';

    // Send onboarding email
    const onboardingLink = `${process.env.FRONTEND_URL}/admin/onboard?token=${plainToken}`;

    
    try {
      await sendAdminOnboardingEmail({
        email: admin.email,
        adminName: admin.name,
        creatorName: creatorName,
        onboardingLink: onboardingLink,
        expiresInHours: 48
      });
      console.log(`✅ Onboarding email resent to ${admin.email}`);
    } catch (error) {
      console.error(`❌ Failed to resend onboarding email to ${admin.email}:`, error);
      // Still return success - token is generated, email can be retried
    }

    return res.status(200).json({
      success: true,
      message: 'Onboarding link has been resent successfully',
      data: {
        expiresAt: tokenExpiry
      }
    });
  } catch (error) {
    console.error('Error resending onboarding link:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resend onboarding link',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/admin/admins/:id/invalidate-onboarding-link
 * @desc    Invalidate active onboarding link (admin control for security)
 * @access  Admin only
 */
export const invalidateOnboardingLink = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin ID'
      });
    }

    const admin = await User.findOne({ _id: id, role: 'admin' });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check if admin is already verified
    if (admin.isVerfied) {
      return res.status(400).json({
        success: false,
        message: 'Admin is already verified. No active onboarding link to invalidate.'
      });
    }

    // Check if token is already used or invalidated
    if (admin.onboardingTokenUsed) {
      return res.status(400).json({
        success: false,
        message: 'Onboarding token has already been used'
      });
    }

    if (admin.onboardingTokenInvalidated) {
      return res.status(400).json({
        success: false,
        message: 'Onboarding token is already invalidated'
      });
    }

    // Invalidate the token
    admin.onboardingTokenInvalidated = true;
    await admin.save();

    console.log(`✅ Onboarding link invalidated for admin ${admin.email} by admin ${req.user.id}`);

    return res.status(200).json({
      success: true,
      message: 'Onboarding link has been invalidated successfully. A new link can be sent if needed.'
    });
  } catch (error) {
    console.error('Error invalidating onboarding link:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to invalidate onboarding link',
      error: error.message
    });
  }
};
