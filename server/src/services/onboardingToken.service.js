import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a secure onboarding token
 * @returns {string} Secure random token (64 hex characters)
 */
export const generateOnboardingToken = () => {
  return crypto.randomBytes(32).toString('hex'); // 64 character hex string
};

/**
 * Hash onboarding token for secure storage
 * @param {string} token - Plain text token
 * @returns {Promise<string>} Hashed token
 */
export const hashOnboardingToken = async (token) => {
  const saltRounds = 10;
  return await bcrypt.hash(token, saltRounds);
};

/**
 * Compare plain token with hashed token
 * @param {string} plainToken - Plain text token
 * @param {string} hashedToken - Hashed token from database
 * @returns {Promise<boolean>} True if tokens match
 */
export const compareOnboardingToken = async (plainToken, hashedToken) => {
  if (!plainToken || !hashedToken) return false;
  return await bcrypt.compare(plainToken, hashedToken);
};

/**
 * Calculate token expiry date (default: 48 hours from now)
 * @param {number} hours - Hours until expiry (default: 48)
 * @returns {Date} Expiry date
 */
export const calculateTokenExpiry = (hours = 48) => {
  const now = new Date();
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
};

/**
 * Check if token is expired
 * @param {Date} expiresAt - Token expiry date
 * @returns {boolean} True if expired
 */
export const isTokenExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
};

/**
 * Validate onboarding token status
 * @param {Object} admin - Admin user object with token fields
 * @param {string} plainToken - Plain text token to validate
 * @returns {Object} { valid: boolean, reason?: string }
 */
export const validateOnboardingToken = async (admin, plainToken) => {
  // Check if admin has onboarding token
  if (!admin.onboardingToken) {
    return { valid: false, reason: 'No onboarding token found' };
  }

  // Check if token is already used
  if (admin.onboardingTokenUsed) {
    return { valid: false, reason: 'Onboarding token has already been used' };
  }

  // Check if token is invalidated
  if (admin.onboardingTokenInvalidated) {
    return { valid: false, reason: 'Onboarding token has been invalidated' };
  }

  // Check if token is expired
  if (isTokenExpired(admin.onboardingTokenExpiresAt)) {
    return { valid: false, reason: 'Onboarding token has expired' };
  }

  // Verify token matches
  const tokenMatches = await compareOnboardingToken(plainToken, admin.onboardingToken);
  if (!tokenMatches) {
    return { valid: false, reason: 'Invalid onboarding token' };
  }

  return { valid: true };
};
