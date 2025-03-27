const HourlyAggregate = require('../models/hourlyAggregate');
const TemperatureReading = require('../models/temperatureReading');
const logger = require('../utils/logger');

class ReportController {
    async getWeeklyReport(req, res) {
        try {
            const now = Math.floor(Date.now() / 1000);
            const weekAgo = now - (7 * 24 * 60 * 60);
            
            // Add debug logging
            logger.info(`Fetching weekly report from ${new Date(weekAgo * 1000)} to ${new Date(now * 1000)}`);
            
            const aggregates = await HourlyAggregate.find({
                timestamp: { 
                    $gte: weekAgo,
                    $lte: now
                }
            })
            .sort({ timestamp: -1, face: 1 })
            .select('-__v');

            // Add more debug logging
            logger.info(`Found ${aggregates.length} aggregates`);
            if (aggregates.length > 0) {
                logger.info(`Sample aggregate: ${JSON.stringify(aggregates[0])}`);
            }

            const report = {
                startDate: new Date(weekAgo * 1000).toISOString(),
                endDate: new Date(now * 1000).toISOString(),
                data: aggregates,
                debug: {
                    weekAgo,
                    now,
                    aggregatesFound: aggregates.length
                }
            };

            res.json(report);
        } catch (error) {
            logger.error('Error generating weekly report:', error);
            res.status(500).json({
                error: 'Failed to generate weekly report',
                details: error.message
            });
        }
    }

    async getMalfunctioningReport(req, res) {
        try {
            const faces = ['north', 'south', 'east', 'west'];
            const result = [];

            for (const face of faces) {
                // Get latest reading for each sensor on this face
                const latestReadings = await TemperatureReading.aggregate([
                    { 
                        $match: { face }
                    },
                    {
                        $sort: { timestamp: -1 }
                    },
                    {
                        $group: {
                            _id: "$id",
                            face: { $first: "$face" },
                            temperature: { $first: "$temperature" },
                            status: { $first: "$status" }
                        }
                    }
                ]);


                if (latestReadings.length < 2) continue;

                // Get normal sensors average
                const normalSensors = latestReadings.filter(r => r.status === 'normal');

                if (normalSensors.length >= 2) {
                    const normalAvg = normalSensors.reduce((sum, r) => sum + r.temperature, 0) / normalSensors.length;

                    // Get malfunctioning sensors
                    const malfunctioning = latestReadings.filter(r => r.status === 'malfunctioning');
                    console.log('Malfunctioning sensors:', malfunctioning);

                    malfunctioning.forEach(sensor => {
                        const deviation = Math.abs(sensor.temperature - normalAvg) / normalAvg;
                        result.push({
                            id: sensor._id,
                            face: sensor.face,
                            currentTemperature: sensor.temperature,
                            averageTemperature: normalAvg,
                            deviationPercentage: +(deviation * 100).toFixed(2)
                        });
                    });
                }
            }

            res.json({
                timestamp: Math.floor(Date.now() / 1000),
                totalMalfunctioning: result.length,
                sensors: result
            });
        } catch (error) {
            logger.error('Error generating malfunction report:', error);
            res.status(500).json({
                error: 'Failed to generate malfunction report'
            });
        }
    }
}

module.exports = new ReportController();