class ApiResponse {
  static success(res, message, data = null, statusCode = 200, meta = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message, statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ApiResponse;
