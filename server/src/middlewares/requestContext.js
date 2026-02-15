/**
 * Attach requestId to each request and response for tracing.
 */

import { randomUUID } from 'crypto';
import logger from '../platform/logging/logger.js';

const HEADER_REQUEST_ID = 'x-request-id';

export function requestContext(req, res, next) {
  const id = req.headers[HEADER_REQUEST_ID] || randomUUID();
  req.id = id;
  req.log = logger.child({ requestId: id, route: req.path, method: req.method });
  res.setHeader(HEADER_REQUEST_ID, id);
  next();
}
