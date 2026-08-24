const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Ensure both handler arguments are defined functions
router.post('/', authMiddleware, bookingController.createBooking);

module.exports = router;