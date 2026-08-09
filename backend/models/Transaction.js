import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    type: { type: String, enum: ['COIN', 'NOTE', 'SYSTEM'], required: true },
    denomination: { type: Number, required: true },
    count: { type: Number, required: true },
    amount: { type: Number, required: true },
    channel: { type: String, default: 'Automated Sensor' },
    status: { type: String, default: 'Verified' }
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
