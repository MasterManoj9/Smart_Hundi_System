import express from 'express';
import { addDonation, toggleMachineAlert, getHundiSummary } from '../services/hundiStore.js';

const router = express.Router();

// ESP32 Webhook: Pulse signal when a coin or note passes through the counter sensor
router.post('/pulse', (req, res) => {
  const { apiKey, type, denomination, count = 1, sensorChannel } = req.body;

  // Optional simple API key validation for ESP32 hardware
  if (apiKey && apiKey !== 'ESP32_HUNDI_API_KEY_SECRET') {
    return res.status(403).json({ success: false, message: 'Invalid ESP32 API Key' });
  }

  if (!type || !denomination) {
    return res.status(400).json({ success: false, message: 'Missing type or denomination' });
  }

  const result = addDonation({ type: type.toUpperCase(), denomination: Number(denomination), count: Number(count) });

  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }

  console.log(`[ESP32 Hardware Event] ${type} ₹${denomination} (Qty: ${count}) via ${sensorChannel || 'Sensor Pin'}`);

  res.json({
    status: 'ACK',
    receivedAt: new Date().toISOString(),
    transactionId: result.transaction.id,
    summary: getHundiSummary()
  });
});

// ESP32 Webhook: Telemetry heartbeat & diagnostics update
router.post('/telemetry', (req, res) => {
  const { isOnline = true, temperature, coinJam, noteJam, wifiSignal, sensorHealth } = req.body;

  if (coinJam !== undefined) toggleMachineAlert({ alertType: 'coinJam', value: coinJam });
  if (noteJam !== undefined) toggleMachineAlert({ alertType: 'noteJam', value: noteJam });
  if (isOnline !== undefined) toggleMachineAlert({ alertType: 'isOnline', value: isOnline });

  res.json({
    status: 'TELEMETRY_OK',
    serverTimestamp: new Date().toISOString(),
    command: 'CONTINUE'
  });
});

// Hardware config query
router.get('/config', (req, res) => {
  res.json({
    hundiId: 'TH-MAIN-01',
    pollIntervalMs: 2000,
    maxCoinBox: 5000,
    maxNoteBox: 1500,
    firmwareTarget: 'v2.8.4',
    serverTime: new Date().toISOString()
  });
});

export default router;
