require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const consultantRoutes = require('./routes/consultantRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ConnecT Backend API is Live and Running!' });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/consultants', consultantRoutes);
app.use('/api/v1/bookings', bookingRoutes);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`>>> ConnecT API active and listening at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});