import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import hundiRoutes from './routes/hundi.js';
import transactionRoutes from './routes/transactions.js';
import iotRoutes from './routes/iot.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for frontend integration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize DB (attempts Mongoose connection, falls back to in-memory store)
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hundi', hundiRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/iot', iotRoutes);

// Root Status
app.get('/', (req, res) => {
  res.json({
    app: 'Smart IoT-AI Enabled Automated Hundi System API',
    status: 'ONLINE',
    version: '1.0.0',
    documentation: {
      auth: '/api/auth/login',
      summary: '/api/hundi/summary',
      graphs: '/api/hundi/graphs',
      transactions: '/api/transactions',
      iotPulse: '/api/iot/pulse'
    }
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Smart Hundi Backend Server running on port ${PORT}`);
  console.log(`📡 ESP32 API Endpoint ready at http://localhost:${PORT}/api/iot/pulse`);
  console.log(`=======================================================`);
});
