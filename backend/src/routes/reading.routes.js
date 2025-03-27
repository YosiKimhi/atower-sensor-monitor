const express = require('express');
const router = express.Router();
const readingController = require('../controllers/readingController');
const { validateReading } = require('../middleware/validator');

// Ingest new sensor reading
router.post('/', validateReading, readingController.ingestReading);

module.exports = router;