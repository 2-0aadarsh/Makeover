import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
}, { collection: 'counters' });

const Counter = mongoose.model('Counter', counterSchema);

/**
 * Atomically get next sequence number for order numbers.
 * Uses MongoDB findOneAndUpdate for atomic increment (no race condition).
 * On first use, initializes from current Order count to avoid duplicates.
 * @returns {Promise<string>} Order number (e.g. "ORD000014")
 */
export const getNextOrderNumber = async () => {
  const existing = await Counter.findById('orderNumber');
  if (!existing) {
    const { default: Order } = await import('./order.model.js');
    const orderCount = await Order.countDocuments();
    await Counter.findByIdAndUpdate(
      'orderNumber',
      { $set: { seq: orderCount } },
      { upsert: true, new: true }
    );
  }

  const result = await Counter.findOneAndUpdate(
    { _id: 'orderNumber' },
    { $inc: { seq: 1 } },
    { new: true }
  );
  return `ORD${String(result.seq).padStart(6, '0')}`;
};

export default Counter;
