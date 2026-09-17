const express = require('express');
const router = express.Router();
const consultantController = require('../controllers/consultantController');
const authMiddleware = require('../middleware/authMiddleware');
const { cacheResponse } = require('../middleware/cacheMiddleware');

router.get('/', cacheResponse(60_000), consultantController.getConsultants);
router.post('/apply', authMiddleware, consultantController.applyConsultant);

module.exports = router;
