const mongoose = require('mongoose');

const hourlyAggregateSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: true
    },
    face: {
        type: String,
        enum: ['south', 'east', 'north', 'west'],
        required: true
    },
    averageTemperature: {
        type: Number,
        required: true
    }
});

hourlyAggregateSchema.index({ timestamp: -1 });

module.exports = mongoose.model('HourlyAggregate', hourlyAggregateSchema); 