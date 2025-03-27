const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Get weekly temperature report
router.get('/weekly', reportController.getWeeklyReport);

// Get malfunctioning sensors report
router.get('/malfunctioning', reportController.getMalfunctioningReport);

module.exports = router;
