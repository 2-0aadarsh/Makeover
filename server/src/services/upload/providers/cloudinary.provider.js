import { v2 as cloudinary } from 'cloudinary';
import ImageUploadService from '../imageUpload.service.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Cloudinary Image Upload Provider
 * 
 * Handles image uploads to Cloudinary cloud storage.
 * Uses existing Cloudinary configuration from configs/cloudinary.config.js
 */

class CloudinaryProvider extends ImageUploadService {
  constructor() {
    super();
    
    // Initialize Cloudinary with environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    
    console.log('📸 CloudinaryProvider initialized');
  }

  /**
   * Upload an image to Cloudinary
   * @param {Object} file - File object from express-fileupload
   * @param {String} folder - Cloudinary folder name
   * @returns {Promise<Object>} - { url, publicId, provider }
   */
  async upload(file, folder = 'general') {
    try {
      // express-fileupload provides file.data (buffer) or file.tempFilePath
      // We'll save to temp file if needed, then upload
      
      let tempFilePath = file.tempFilePath;
      let shouldDeleteTemp = false;

      // If no temp file path, create one from buffer
      if (!tempFilePath && file.data) {
        const tempDir = os.tmpdir();
        const fileName = `upload_${Date.now()}_${file.name}`;
        tempFilePath = path.join(tempDir, fileName);
        
        // Write buffer to temp file
        fs.writeFileSync(tempFilePath, file.data);
        shouldDeleteTemp = true;
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: `wemakeover/${folder}`,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Clean up temp file if we created it
      if (shouldDeleteTemp && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        provider: 'cloudinary'
      };

    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param {String} publicId - Cloudinary public ID
   * @returns {Promise<void>}
   */
  async delete(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error(`Cloudinary delete failed: ${result.result}`);
      }
      
      console.log('🗑️ Image deleted from Cloudinary:', publicId);
      
    } catch (error) {
      console.error('❌ Cloudinary delete error:', error);
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }

  /**
   * Get the URL of an uploaded image
   * @param {String} publicId - Cloudinary public ID
   * @returns {String} - Full URL of the image
   */
  getUrl(publicId) {
    return cloudinary.url(publicId, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto'
    });
  }

  /**
   * Get optimized URL with transformations
   * @param {String} publicId - Cloudinary public ID
   * @param {Object} options - Transformation options
   * @returns {String} - Optimized URL
   */
  getOptimizedUrl(publicId, options = {}) {
    const defaultOptions = {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    };
    
    return cloudinary.url(publicId, defaultOptions);
  }
}

export default CloudinaryProvider;
