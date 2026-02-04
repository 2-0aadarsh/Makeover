/**
 * MongoDB config: re-exports from platform layer for backward compatibility.
 */

import 'dotenv/config';
import { connect, getConnectionPromise, status, isConnected, READY_STATE, ensureConnected } from '../platform/db/mongo.js';

export default connect;
export { getConnectionPromise, status, isConnected, READY_STATE, ensureConnected };
