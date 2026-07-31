const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack, path: req.path });

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return ApiResponse.error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
};

const notFoundHandler = (req, res) => {
  return ApiResponse.error(res, `API route not found: ${req.method} ${req.originalUrl}`, 404);
};

module.exports = { errorHandler, notFoundHandler };
