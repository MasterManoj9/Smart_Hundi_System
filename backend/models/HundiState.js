import mongoose from 'mongoose';

const hundiStateSchema = new mongoose.Schema(
  {
    hundiId: { type: String, default: 'TH-MAIN-01', unique: true },
    isOnline: { type: Boolean, default: true },
    coinJam: { type: Boolean, default: false },
    noteJam: { type: Boolean, default: false },
    storageFullWarning: { type: Boolean, default: false },
    doorLocked: { type: Boolean, default: true },
    temperature: { type: Number, default: 32.5 },
    sensorHealth: { type: String, default: 'OPTIMAL' },
    counts: {
      coin: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
        10: { type: Number, default: 0 }
      },
      note: {
        10: { type: Number, default: 0 },
        20: { type: Number, default: 0 },
        50: { type: Number, default: 0 },
        100: { type: Number, default: 0 },
        200: { type: Number, default: 0 },
        500: { type: Number, default: 0 }
      }
    }
  },
  { timestamps: true }
);

export default mongoose.models.HundiState || mongoose.model('HundiState', hundiStateSchema);
