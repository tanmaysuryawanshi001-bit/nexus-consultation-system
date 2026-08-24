const express = require('express');
const router = express.Router();
const consultantController = require('../controllers/consultantController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', consultantController.getConsultants);
router.post('/apply', authMiddleware, consultantController.applyConsultant);

module.exports = router;