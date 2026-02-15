import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Configuration
const TOKEN_LENGTH = 32; // 32 bytes = 64 hex characters
const TOKEN_EXPIRY_DAYS = 90; // Token valid for 90 days

/**
 * Generate a secure random token for review links
 * @returns {string} Hex-encoded random token
 */
export const generateReviewToken = () => {
  return crypto.randomBytes(TOKEN_LENGTH).toString('hex');
};

/**
 * Generate token expiry date
 * @param {number} days - Number of days until expiry (default: 90)
 * @returns {Date} Expiry date
 */
export const generateTokenExpiry = (days = TOKEN_EXPIRY_DAYS) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
};

/**
 * Check if a token has expired
 * @param {Date} expiryDate - Token expiry date
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (expiryDate) => {
  if (!expiryDate) return true;
  return new Date() > new Date(expiryDate);
};

/**
 * Generate the review URL with token
 * @param {string} token - Review token
 * @param {string} type - 'review' or 'complaint'
 * @returns {string} Full review URL
 */
export const generateReviewUrl = (token, type = 'review') => {
  const baseUrl = process.env.FRONTEND_URL;
  return `${baseUrl}/reviews/submit?token=${token}&type=${type}`;
};

/**
 * Hash a token for secure storage (optional - for extra security)
 * @param {string} token - Plain token
 * @returns {string} Hashed token
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Verify a token against a hash
 * @param {string} plainToken - Plain token to verify
 * @param {string} hashedToken - Stored hash
 * @returns {boolean} True if matches
 */
export const verifyToken = (plainToken, hashedToken) => {
  const hash = hashToken(plainToken);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hashedToken));
};

export default {
  generateReviewToken,
  generateTokenExpiry,
  isTokenExpired,
  generateReviewUrl,
  hashToken,
  verifyToken,
};
