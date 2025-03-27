const TemperatureReading = require('../models/temperatureReading');
const HourlyAggregate = require('../models/hourlyAggregate');
const logger = require('../utils/logger');

class SensorProcessingService {
    async processNewReading(reading) {
        try {
            // Save the reading
            await TemperatureReading.create(reading);

            // Check for malfunction
            await this.checkForMalfunction(reading);

            // Update hourly aggregate
            await this.updateHourlyAggregate(reading);

            logger.info(`Reading processed successfully for sensor ${reading.id}`);
        } catch (error) {
            logger.error('Error processing reading:', error);
            throw error;
        }
    }

    async checkForMalfunction(reading) {
        try {
            const recentReadings = await TemperatureReading.find({
                face: reading.face,
                timestamp: { $gte: reading.timestamp - 60 },
                id: { $ne: reading.id },
                status: 'normal'  // Only compare against normal sensors
            });

            if (recentReadings.length === 0) return 'normal';

            const avgTemp = recentReadings.reduce((sum, r) => sum + r.temperature, 0) / recentReadings.length;
            const deviation = Math.abs(reading.temperature - avgTemp) / avgTemp;

            const status = deviation > 0.2 ? 'malfunctioning' : 'normal';

            if (status === 'malfunctioning') {
                logger.warn(`SENSOR MALFUNCTION DETECTED:
                    - Sensor ID: ${reading.id}
                    - Face: ${reading.face}
                    - Current Temperature: ${reading.temperature}°C
                    - Average Temperature: ${avgTemp.toFixed(2)}°C
                    - Deviation: ${(deviation * 100).toFixed(2)}%
                `);
            }

            // Update the reading's status
            await TemperatureReading.updateOne(
                { id: reading.id, timestamp: reading.timestamp },
                { $set: { status: status } }
            );

            return status;
        } catch (error) {
            logger.error('Error checking for malfunction:', error);
            throw error;
        }
    }

    async updateHourlyAggregate(reading) {
        try {
            // Round timestamp to start of hour
            const hourStart = Math.floor(reading.timestamp / 3600) * 3600;
            
            // Get all readings for this hour and face
            const readings = await TemperatureReading.find({
                face: reading.face,
                timestamp: {
                    $gte: hourStart,
                    $lt: hourStart + 3600
                }
            });
    
            if (readings.length < 2) return;
    
            // First pass: identify malfunctioning sensors
            const initialAvg = readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length;
            const malfunctioningSensors = new Set();
    
            readings.forEach(sensor => {
                const deviation = Math.abs(sensor.temperature - initialAvg) / initialAvg;
                if (deviation > 0.2) {
                    malfunctioningSensors.add(sensor.id);
                }
            });
    
            // Calculate final average using only normal sensors
            const normalReadings = readings.filter(sensor => !malfunctioningSensors.has(sensor.id));
            
            if (normalReadings.length >= 2) {
                const normalAvg = normalReadings.reduce((sum, r) => sum + r.temperature, 0) / normalReadings.length;
                
                // Update the hourly aggregate with the normal sensors average
                await HourlyAggregate.updateOne(
                    { 
                        timestamp: hourStart,
                        face: reading.face
                    },
                    {
                        $set: { averageTemperature: normalAvg }
                    },
                    { upsert: true }
                );
            }
        } catch (error) {
            logger.error('Error updating hourly aggregate:', error);
            throw error;
        }
    }

    async checkInactiveSensors() {
        const now = Math.floor(Date.now() / 1000);
        const twentyFourHoursAgo = now - (24 * 60 * 60);
        
        // Get all unique sensor IDs from last 24 hours
        const activeIds = await TemperatureReading.distinct('id', {
            timestamp: { $gte: twentyFourHoursAgo }
        });

        logger.sensor.info(`Active sensors in last 24 hours: ${activeIds.length}`);
        
        // You might want to store this information or trigger alerts
        return activeIds;
    }
}

module.exports = new SensorProcessingService();
