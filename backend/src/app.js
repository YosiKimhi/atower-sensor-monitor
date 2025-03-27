const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware
//Help secure Express apps by setting HTTP response headers.
app.use(helmet());
//Enable Cross-Origin Resource Sharing (CORS) to allow or restrict web pages from making requests to a different domain than the one that served the web page.
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));
//Parse incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
//Parse incoming requests with URL-encoded payloads and is based on body-parser.
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandler);

module.exports = app;