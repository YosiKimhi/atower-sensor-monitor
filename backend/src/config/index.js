module.exports = {
    port: process.env.PORT || 4000,
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV || 'development'
};