const TemperatureReading = require('../models/temperatureReading');
const sensorProcessingService = require('../services/sensorProcessing');
const logger = require('../utils/logger');

class ReadingController {
    async ingestReading(req, res) {
        try {
            const reading = req.body;
            
            // Save reading and process it
            await sensorProcessingService.processNewReading(reading);

            res.status(200).json({
                message: 'Reading processed successfully'
            });
        } catch (error) {
            logger.error('Error ingesting reading:', error);
            res.status(500).json({
                error: 'Failed to process reading',
                details: error.message
            });
        }
    }
}

module.exports = new ReadingController(); 