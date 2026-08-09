import express from 'express';
import { getTransactions, addDonation } from '../services/hundiStore.js';

const router = express.Router();

// Fetch transactions with optional search query & date filter
router.get('/', (req, res) => {
  try {
    const { search = '', filterDate = 'all' } = req.query;
    const items = getTransactions(search, filterDate);
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add manual donation (for software testing / manual vault deposit)
router.post('/add', (req, res) => {
  try {
    const { type, denomination, count } = req.body;
    const result = addDonation({ type, denomination, count });
    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }
    res.json({
      success: true,
      message: 'Donation recorded successfully',
      transaction: result.transaction
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
