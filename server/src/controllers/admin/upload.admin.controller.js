import UploadFactory from '../../services/upload/uploadFactory.js';
import { validateFile, getFileFromRequest } from '../../utils/fileValidation.utils.js';
import { v2 as cloudinary } from 'cloudinary';

/**
 * @route   GET /api/admin/upload/test-config
 * @desc    Test Cloudinary configuration
 * @access  Admin only
 */
export const testCloudinaryConfig = async (req, res) => {
  try {
    // Check if env variables are set
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : undefined
    };

    const missingVars = [];
    if (!process.env.CLOUDINARY_CLOUD_NAME) missingVars.push('CLOUDINARY_CLOUD_NAME');
    if (!process.env.CLOUDINARY_API_KEY) missingVars.push('CLOUDINARY_API_KEY');
    if (!process.env.CLOUDINARY_API_SECRET) missingVars.push('CLOUDINARY_API_SECRET');

    if (missingVars.length > 0) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary configuration incomplete',
        missingVariables: missingVars,
        hint: 'Check your .env file and make sure these variables are set'
      });
    }

    // Test Cloudinary connection by calling ping
    try {
      await cloudinary.api.ping();
      
      return res.status(200).json({
        success: true,
        message: 'Cloudinary is configured correctly',
        config: config,
        status: 'Connected ✅'
      });
    } catch (pingError) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary connection failed',
        error: pingError.message,
        config: config,
        hint: 'Check if your Cloudinary credentials are correct and your account is active'
      });
    }

  } catch (error) {
    console.error('❌ Config test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to test Cloudinary configuration',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/admin/upload/test
 * @desc    Test image upload endpoint
 * @access  Admin only
 */
export const testImageUpload = async (req, res) => {
  try {
    // Get file from request
    const file = getFileFromRequest(req, 'image');

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Please upload a file with field name "image"'
      });
    }

    console.log('📁 File received:', {
      name: file.name,
      size: file.size,
      mimetype: file.mimetype,
      hasTempFilePath: !!file.tempFilePath,
      hasData: !!file.data
    });

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'File validation failed',
        errors: validation.errors
      });
    }

    // Get upload provider (Cloudinary by default, or S3 if configured)
    const uploader = UploadFactory.getProvider();

    // Upload image
    console.log('⬆️ Uploading to Cloudinary...');
    const uploadResult = await uploader.upload(file, 'test-uploads');
    console.log('✅ Upload successful:', uploadResult);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        provider: uploadResult.provider,
        fileInfo: {
          originalName: file.name,
          size: file.size,
          mimetype: file.mimetype
        }
      }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message,
      hint: 'Check Cloudinary credentials in .env file'
    });
  }
};

/**
 * @route   POST /api/admin/upload/multiple
 * @desc    Test multiple image upload endpoint
 * @access  Admin only
 */
export const testMultipleImageUpload = async (req, res) => {
  try {
    // Get files from request
    if (!req.files || !req.files.images) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided. Please upload files with field name "images"'
      });
    }

    // Handle both single and multiple files
    let files = req.files.images;
    files = Array.isArray(files) ? files : [files];

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files to upload'
      });
    }

    // Validate all files
    const validationErrors = [];
    files.forEach((file, index) => {
      const validation = validateFile(file);
      if (!validation.valid) {
        validationErrors.push(`File ${index + 1} (${file.name}): ${validation.errors.join(', ')}`);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'File validation failed',
        errors: validationErrors
      });
    }

    // Get upload provider
    const uploader = UploadFactory.getProvider();

    // Upload all images
    const uploadResults = await uploader.uploadMultiple(files, 'test-uploads');

    return res.status(200).json({
      success: true,
      message: `${uploadResults.length} image(s) uploaded successfully`,
      data: {
        images: uploadResults,
        count: uploadResults.length
      }
    });

  } catch (error) {
    console.error('❌ Multiple upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/admin/upload/:publicId
 * @desc    Test image deletion endpoint
 * @access  Admin only
 */
export const testImageDelete = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Decode publicId (in case it's URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    // Get upload provider
    const uploader = UploadFactory.getProvider();

    // Delete image
    await uploader.delete(decodedPublicId);

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        publicId: decodedPublicId
      }
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    return res.status(500).json({
      success: false,
      message: 'Image deletion failed',
      error: error.message
    });
  }
};
