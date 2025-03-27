const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        logger.info('MongoDB Connected...');
    } catch (err) {
        logger.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
