/**
 * Health endpoints: /health/live (liveness), /health/ready (readiness).
 */

import express from 'express';
import { isConnected } from '../configs/mongodb.config.js';

const router = express.Router();

router.get('/live', (req, res) => {
  res.status(200).json({ ok: true, status: 'live' });
});

router.get('/ready', async (req, res) => {
  if (isConnected()) {
    return res.status(200).json({ ok: true, status: 'ready', mongo: 'connected' });
  }
  res.status(503).json({
    ok: false,
    status: 'not_ready',
    code: 'DB_UNREACHABLE',
    mongo: 'disconnected',
  });
});

export default router;
