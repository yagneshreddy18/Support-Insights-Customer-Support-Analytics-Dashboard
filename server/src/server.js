const app = require('./app');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Support Insights API server running on port ${PORT}`);
  logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Base API URL: http://localhost:${PORT}/api/v1`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown:', err);
});

module.exports = server;
