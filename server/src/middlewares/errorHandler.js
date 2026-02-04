/**
 * Global error handler: map errors to status codes and consistent JSON.
 */

import logger from '../platform/logging/logger.js';

const KNOWN_CODES = {
  DB_UNREACHABLE: 503,
  SERVICE_UNAVAILABLE: 503,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

export function errorHandler(err, req, res, next) {
  const requestId = req.id || undefined;
  const code = err.code || (err.statusCode === 503 ? 'SERVICE_UNAVAILABLE' : 'INTERNAL_ERROR');
  const statusCode = KNOWN_CODES[code] || err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : (err.message || 'Request failed');

  if (req.log) {
    req.log.error('request_failed', {
      statusCode,
      code,
      message: err.message,
      name: err.name,
    });
  } else {
    logger.error('request_failed', {
      requestId,
      statusCode,
      code,
      message: err.message,
    });
  }

  if (res.headersSent) return next(err);

  res.status(statusCode).json({
    success: false,
    code,
    message,
    requestId,
  });
}
