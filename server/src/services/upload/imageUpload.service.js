/**
 * Base Image Upload Service Interface
 * 
 * This is an abstract base class that defines the contract for all image upload providers.
 * All providers (Cloudinary, S3, Local, etc.) must implement these methods.
 * 
 * This design allows easy switching between providers by just changing an environment variable.
 */

class ImageUploadService {
  /**
   * Upload an image file
   * @param {Object} file - File object from express-fileupload
   * @param {String} folder - Folder/path to store the image
   * @returns {Promise<Object>} - { url, publicId, provider }
   */
  async upload(file, folder = 'general') {
    throw new Error('upload() method must be implemented by provider');
  }

  /**
   * Delete an image
   * @param {String} publicId - Public ID or key of the image
   * @returns {Promise<void>}
   */
  async delete(publicId) {
    throw new Error('delete() method must be implemented by provider');
  }

  /**
   * Get the URL of an uploaded image
   * @param {String} publicId - Public ID or key of the image
   * @returns {String} - Full URL of the image
   */
  getUrl(publicId) {
    throw new Error('getUrl() method must be implemented by provider');
  }

  /**
   * Upload multiple images
   * @param {Array} files - Array of file objects
   * @param {String} folder - Folder/path to store the images
   * @returns {Promise<Array>} - Array of { url, publicId, provider }
   */
  async uploadMultiple(files, folder = 'general') {
    const uploadPromises = files.map(file => this.upload(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete multiple images
   * @param {Array} publicIds - Array of public IDs
   * @returns {Promise<void>}
   */
  async deleteMultiple(publicIds) {
    const deletePromises = publicIds.map(id => this.delete(id));
    return Promise.all(deletePromises);
  }
}

export default ImageUploadService;
