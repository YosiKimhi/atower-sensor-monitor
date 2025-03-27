require('dotenv').config();
const app = require('./app');
const connectDB = require('./services/database');
const logger = require('./utils/logger');
const config = require('./config');

const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
