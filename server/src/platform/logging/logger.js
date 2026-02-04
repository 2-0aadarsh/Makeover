/**
 * Structured logger for searchable logs and request correlation.
 * Use child({ requestId }) in middleware to attach requestId to all logs.
 */

const SERVICE = 'makeover-api';
const ENV = process.env.NODE_ENV || 'development';

function base(level, event, meta = {}) {
  const payload = {
    level,
    service: SERVICE,
    env: ENV,
    event,
    ...meta,
    ts: new Date().toISOString(),
  };
  const line = JSON.stringify(payload);
  if (level === 'error' || level === 'fatal') {
    process.stderr.write(line + '\n');
  } else {
    process.stdout.write(line + '\n');
  }
}

const logger = {
  info(event, meta) {
    base('info', event, meta);
  },
  warn(event, meta) {
    base('warn', event, meta);
  },
  error(event, meta) {
    base('error', event, meta);
  },
  fatal(event, meta) {
    base('fatal', event, meta);
  },
  /**
   * Create a child logger that adds requestId (and optional route) to every log.
   * Use in request-scoped code: logger.child({ requestId: req.id, route: req.path }).
   */
  child(fields = {}) {
    return {
      info(ev, m = {}) {
        logger.info(ev, { ...fields, ...m });
      },
      warn(ev, m = {}) {
        logger.warn(ev, { ...fields, ...m });
      },
      error(ev, m = {}) {
        logger.error(ev, { ...fields, ...m });
      },
      fatal(ev, m = {}) {
        logger.fatal(ev, { ...fields, ...m });
      },
    };
  },
};

export default logger;
