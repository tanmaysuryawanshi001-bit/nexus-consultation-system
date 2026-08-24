require('dotenv').config();
const express = require('express');
import cors from 'cors';

const allowedOrigins = [
  'https://nexus-consultation-system.vercel.app',
  'https://nexus-consultation-system-git-main-tanmay-626a.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl, Postman, or mobile apps)
    if (!origin) return callback(null, true);
    
    // Allow if exact match or if it's any Vercel preview deployment URL
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight requests for all routes
app.options('*', cors());

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