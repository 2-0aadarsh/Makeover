/**
 * MongoDB connection lifecycle: connect, status, ensureConnected.
 * Does not exit on failure so readiness can return 503.
 */

import mongoose from 'mongoose';
import logger from '../logging/logger.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI?.trim()) {
  logger.fatal('config_error', { message: 'MONGODB_URI is not defined in environment variables' });
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

let connectionPromise = null;

/**
 * Start connection. Safe to call multiple times; returns same promise.
 * Rejects on failure (no process.exit) so app can return 503.
 */
export function connect() {
  if (connectionPromise) return connectionPromise;
  connectionPromise = (async () => {
    try {
      await mongoose.connect(MONGODB_URI);
      logger.info('db_connected', { message: 'MongoDB connected successfully' });
    } catch (error) {
      logger.fatal('db_connect_failed', {
        message: error.message,
        name: error.name,
        code: error.code,
      });
      connectionPromise = null;
      throw error;
    }
  })();
  return connectionPromise;
}

/**
 * Promise that resolves when DB is connected, or rejects on failure.
 */
export function getConnectionPromise() {
  return connectionPromise || connect();
}

/**
 * 1 = connected, 2 = connecting, 0 = disconnected, 3 = disconnecting.
 */
export function status() {
  return mongoose.connection.readyState;
}

export const READY_STATE = {
  disconnected: 0,
  connected: 1,
  connecting: 2,
  disconnecting: 3,
};

export function isConnected() {
  return status() === READY_STATE.connected;
}

/**
 * Wait for connection with optional timeout. For use in readiness checks.
 */
export async function ensureConnected({ timeoutMs = 10000 } = {}) {
  if (isConnected()) return;
  const p = getConnectionPromise();
  const t = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('MongoDB connection timeout')), timeoutMs)
  );
  await Promise.race([p, t]);
}
