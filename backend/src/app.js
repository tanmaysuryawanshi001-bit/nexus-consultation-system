require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const consultantRoutes = require('./routes/consultantRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Allowed Origins for Vercel & Local Development
const allowedOrigins = [
  'https://nexus-consultation-system.vercel.app',
  'https://nexus-consultation-system-git-main-tanmay-626a.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Global Middleware
app.use(cors(corsOptions));
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
  console.log(`>>> ConnecT API active and listening on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});