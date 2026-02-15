import CloudinaryProvider from './providers/cloudinary.provider.js';
import S3Provider from './providers/s3.provider.js';

/**
 * Upload Factory
 * 
 * Factory pattern to select the appropriate upload provider based on environment configuration.
 * This allows easy switching between Cloudinary, S3, or other providers without changing code.
 * 
 * Usage:
 *   const uploader = UploadFactory.getProvider();
 *   const result = await uploader.upload(file, 'categories');
 * 
 * To switch providers, just change IMAGE_UPLOAD_PROVIDER in .env:
 *   - cloudinary (default)
 *   - s3 (requires AWS SDK installation)
 *   - local (for development)
 */

class UploadFactory {
  /**
   * Get the configured upload provider
   * @returns {ImageUploadService} - Upload provider instance
   */
  static getProvider() {
    const provider = process.env.IMAGE_UPLOAD_PROVIDER || 'cloudinary';
    
    console.log(`🔧 Using image upload provider: ${provider}`);
    
    switch (provider.toLowerCase()) {
      case 'cloudinary':
        return new CloudinaryProvider();
        
      case 's3':
        return new S3Provider();
        
      case 'local':
        // TODO: Implement LocalProvider for development
        throw new Error('Local provider not implemented yet. Use cloudinary for now.');
        
      default:
        console.warn(`⚠️ Unknown provider "${provider}", falling back to Cloudinary`);
        return new CloudinaryProvider();
    }
  }

  /**
   * Validate that the required environment variables are set for the current provider
   * @returns {Boolean} - True if valid, throws error if invalid
   */
  static validateConfig() {
    const provider = process.env.IMAGE_UPLOAD_PROVIDER || 'cloudinary';
    
    switch (provider.toLowerCase()) {
      case 'cloudinary':
        if (!process.env.CLOUDINARY_CLOUD_NAME || 
            !process.env.CLOUDINARY_API_KEY || 
            !process.env.CLOUDINARY_API_SECRET) {
          throw new Error('Missing Cloudinary configuration. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
        }
        return true;
        
      case 's3':
        if (!process.env.AWS_REGION || 
            !process.env.AWS_ACCESS_KEY_ID || 
            !process.env.AWS_SECRET_ACCESS_KEY || 
            !process.env.AWS_S3_BUCKET_NAME) {
          throw new Error('Missing AWS S3 configuration. Check AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME in .env');
        }
        return true;
        
      default:
        console.warn(`⚠️ No validation for provider "${provider}"`);
        return true;
    }
  }
}

export default UploadFactory;
