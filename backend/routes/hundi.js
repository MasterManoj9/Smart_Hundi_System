import express from 'express';
import { getHundiSummary, getCollectionGraphs, resetCounts, toggleMachineAlert } from '../services/hundiStore.js';

const router = express.Router();

// Get main dashboard overview data
router.get('/summary', (req, res) => {
  try {
    const summary = getHundiSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get daily, weekly, and monthly collection charts
router.get('/graphs', (req, res) => {
  try {
    const graphs = getCollectionGraphs();
    res.json({ success: true, data: graphs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset machine counts (Clear vaults for next period)
router.post('/reset', (req, res) => {
  try {
    const result = resetCounts();
    res.json({ success: true, message: 'All vault denomination counts successfully reset to zero.', result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle alert state for testing/hardware simulation
router.post('/toggle-alert', (req, res) => {
  try {
    const { alertType, value } = req.body;
    const result = toggleMachineAlert({ alertType, value });
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }
    res.json({ success: true, data: result.machineStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
