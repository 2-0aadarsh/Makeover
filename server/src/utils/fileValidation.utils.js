/**
 * File Validation Utilities
 * 
 * Provides validation for uploaded files including:
 * - File size limits
 * - File type/mimetype validation
 * - File extension validation
 */

// Maximum file size: 5MB
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB in bytes

// Allowed image mimetypes
const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validate file size
 * @param {Object} file - File object from express-fileupload
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateFileSize = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${fileSizeMB}MB) exceeds maximum allowed size of ${maxSizeMB}MB`
    };
  }

  return { valid: true };
};

/**
 * Validate file type (mimetype)
 * @param {Object} file - File object from express-fileupload
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateFileType = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_MIMETYPES.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Validate file extension
 * @param {Object} file - File object from express-fileupload
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateFileExtension = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Validate file completely (size + type + extension)
 * @param {Object} file - File object from express-fileupload
 * @returns {Object} - { valid: boolean, errors: array }
 */
export const validateFile = (file) => {
  const errors = [];

  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) {
    errors.push(sizeValidation.error);
  }

  const typeValidation = validateFileType(file);
  if (!typeValidation.valid) {
    errors.push(typeValidation.error);
  }

  const extensionValidation = validateFileExtension(file);
  if (!extensionValidation.valid) {
    errors.push(extensionValidation.error);
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
};

/**
 * Validate multiple files
 * @param {Array} files - Array of file objects
 * @returns {Object} - { valid: boolean, errors: array }
 */
export const validateMultipleFiles = (files) => {
  if (!Array.isArray(files)) {
    return { valid: false, errors: ['Invalid files array'] };
  }

  const allErrors = [];

  files.forEach((file, index) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      allErrors.push(`File ${index + 1} (${file.name}): ${validation.errors.join(', ')}`);
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Get file size in human-readable format
 * @param {Number} bytes - File size in bytes
 * @returns {String} - Formatted size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if request has files
 * @param {Object} req - Express request object
 * @returns {Boolean}
 */
export const hasFiles = (req) => {
  return req.files && Object.keys(req.files).length > 0;
};

/**
 * Get file from request
 * @param {Object} req - Express request object
 * @param {String} fieldName - Field name in the form
 * @returns {Object|null} - File object or null
 */
export const getFileFromRequest = (req, fieldName = 'image') => {
  if (!req.files || !req.files[fieldName]) {
    return null;
  }

  return req.files[fieldName];
};

/**
 * Get multiple files from request
 * @param {Object} req - Express request object
 * @param {String} fieldName - Field name in the form
 * @returns {Array} - Array of file objects
 */
export const getMultipleFilesFromRequest = (req, fieldName = 'images') => {
  if (!req.files || !req.files[fieldName]) {
    return [];
  }

  const files = req.files[fieldName];
  
  // If single file, return as array
  return Array.isArray(files) ? files : [files];
};
