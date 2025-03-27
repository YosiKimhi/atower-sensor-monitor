const mongoose = require('mongoose');

const temperatureReadingSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    face: {
        type: String,
        enum: ['south', 'east', 'north', 'west'],
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['normal', 'malfunctioning'],
        default: 'normal'
    }
});

// Indexes for performance
temperatureReadingSchema.index({ id: 1, timestamp: -1 });
temperatureReadingSchema.index({ face: 1, timestamp: -1 });
temperatureReadingSchema.index({ timestamp: -1 });
temperatureReadingSchema.index({ status: 1, timestamp: -1 });

module.exports = mongoose.model('TemperatureReading', temperatureReadingSchema); 