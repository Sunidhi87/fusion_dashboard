import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/intelligence', apiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Fusion Backend is Operational' });
});

// MongoDB Connection
if (process.env.MONGO_URI && process.env.MONGO_URI !== 'your_mongodb_uri_here') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Database'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
  console.warn('⚠️ No MongoDB URI provided in .env. Running in isolated mode (mock database).');
}

app.listen(PORT, () => {
  console.log(`🚀 Fusion Backend Server running on port ${PORT}`);
});
