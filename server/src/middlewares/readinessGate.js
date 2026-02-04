/**
 * Blocks /api/* if MongoDB is not ready; returns 503 with code DB_UNREACHABLE.
 */

import { getConnectionPromise, isConnected } from '../configs/mongodb.config.js';

const CONNECT_TIMEOUT_MS = 15000;

export async function readinessGate(req, res, next) {
  if (isConnected()) return next();

  try {
    await Promise.race([
      getConnectionPromise(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), CONNECT_TIMEOUT_MS)
      ),
    ]);
    return next();
  } catch (err) {
    if (req.log) {
      req.log.error('db_unreachable', {
        message: err.message,
        name: err.name,
      });
    } else {
      console.error('API request blocked: MongoDB not connected', err.message);
    }
    return res.status(503).json({
      success: false,
      code: 'DB_UNREACHABLE',
      message: 'Service temporarily unavailable',
      requestId: req.id || undefined,
    });
  }
}
