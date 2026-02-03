import ImageUploadService from '../imageUpload.service.js';
import { getS3Client, getBucketName } from '../../../configs/s3.config.js';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

/**
 * AWS S3 Image Upload Provider
 * 
 * Handles file uploads (images, PDFs, videos) to AWS S3 bucket.
 * Uses S3 configuration from configs/s3.config.js
 * 
 * Environment Variables Required:
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * - AWS_REGION
 * - AWS_S3_BUCKET_NAME
 */

class S3Provider extends ImageUploadService {
  constructor() {
    super();
    
    // Initialize S3 client and bucket
    this.s3Client = getS3Client();
    this.bucket = getBucketName();
    
    console.log('📦 S3Provider initialized');
  }

  /**
   * Generate unique filename to prevent conflicts
   * @param {String} originalName - Original filename
   * @returns {String} - Unique filename with timestamp and random string
   */
  generateUniqueFileName(originalName) {
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex'); // 8 character random string
    return `${sanitizedName}_${timestamp}_${randomString}${ext}`;
  }

  /**
   * Detect content type based on file extension
   * @param {String} filename - File name
   * @returns {String} - MIME type
   */
  getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.webm': 'video/webm',
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Upload a file to S3
   * @param {Object} file - File object from express-fileupload
   * @param {String} folder - S3 folder/prefix (e.g., 'images', 'pdfs', 'videos')
   * @returns {Promise<Object>} - { url, publicId, provider, width?, height?, format? }
   */
  async upload(file, folder = 'general') {
    try {
      // Validate file
      if (!file) {
        throw new Error('Invalid file object: file is required');
      }

      // express-fileupload provides file.data (buffer) or file.tempFilePath
      // When useTempFiles: true, file.data is empty and we need to read from tempFilePath
      let fileBuffer;
      
      if (file.tempFilePath) {
        // File is in temporary file (useTempFiles: true)
        if (!fs.existsSync(file.tempFilePath)) {
          throw new Error(`Temporary file not found: ${file.tempFilePath}`);
        }
        fileBuffer = fs.readFileSync(file.tempFilePath);
        console.log('📁 Reading file from temp path:', file.tempFilePath, 'Size:', fileBuffer.length, 'bytes');
      } else if (file.data) {
        // File is in memory buffer (useTempFiles: false)
        fileBuffer = Buffer.isBuffer(file.data) 
          ? file.data 
          : Buffer.from(file.data);
        console.log('📁 Reading file from buffer, Size:', fileBuffer.length, 'bytes');
      } else {
        throw new Error('Invalid file object: file.data or file.tempFilePath is required');
      }

      // Validate buffer is not empty
      if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error('File buffer is empty. File may not have been uploaded correctly.');
      }

      // Generate unique filename
      const uniqueFileName = this.generateUniqueFileName(file.name || 'file');
      
      // Construct S3 key (path in bucket)
      const key = `wemakeover/${folder}/${uniqueFileName}`;
      
      // Get content type
      const contentType = this.getContentType(file.name || uniqueFileName);

      // Upload to S3
      // Note: ACL is removed because modern S3 buckets often have ACLs disabled
      // Public access should be configured via bucket policy instead
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        // ACL removed - use bucket policy for public access
        // Optional: Add metadata
        Metadata: {
          originalName: file.name || 'unknown',
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);

      // Construct public URL
      // Format: https://bucket-name.s3.region.amazonaws.com/key
      const region = process.env.AWS_REGION;
      const url = `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
      
      console.log('📤 S3 Upload successful:', {
        bucket: this.bucket,
        key: key,
        url: url,
        region: region
      });

      // For images, try to extract dimensions if possible
      // Note: S3 doesn't provide image metadata, you'd need to process this separately
      const result = {
        url: url,
        publicId: key, // S3 key is used as publicId
        provider: 's3',
        bucket: this.bucket,
        key: key,
      };

      // If it's an image, you might want to add dimensions
      // This would require additional image processing library
      if (contentType.startsWith('image/')) {
        // Optional: Add image dimensions using sharp or similar library
        // result.width = ...
        // result.height = ...
        result.format = path.extname(uniqueFileName).slice(1).toLowerCase();
      }

      return result;

    } catch (error) {
      console.error('❌ S3 upload error:', error);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  /**
   * Delete a file from S3
   * @param {String} publicId - S3 object key (or full URL)
   * @returns {Promise<void>}
   */
  async delete(publicId) {
    try {
      // Extract key from URL if full URL is provided
      let key = publicId;
      if (publicId.startsWith('http')) {
        // Extract key from URL: https://bucket.s3.region.amazonaws.com/key
        const urlParts = publicId.split('.amazonaws.com/');
        if (urlParts.length > 1) {
          key = urlParts[1];
        } else {
          throw new Error('Invalid S3 URL format');
        }
      }

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      console.log(`✅ Deleted from S3: ${key}`);

    } catch (error) {
      console.error('❌ S3 delete error:', error);
      throw new Error(`S3 delete failed: ${error.message}`);
    }
  }

  /**
   * Get the URL of an S3 object
   * @param {String} publicId - S3 object key
   * @returns {String} - Full public URL
   */
  getUrl(publicId) {
    // If already a full URL, return as is
    if (publicId.startsWith('http')) {
      return publicId;
    }

    // Construct URL from key
    const region = process.env.AWS_REGION;
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${publicId}`;
  }
}

export default S3Provider;
