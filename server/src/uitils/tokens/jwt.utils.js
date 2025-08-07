import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateAccessToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn });
};
export const generateRefreshToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
};
