const express = require('express');
const router = express.Router();
const healthRoutes = require('./health.routes');
const readingRoutes = require('./reading.routes');
const reportRoutes = require('./report.routes');

router.use('/health', healthRoutes);
router.use('/readings', readingRoutes);
router.use('/reports', reportRoutes);

module.exports = router;