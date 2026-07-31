const { verifyAccessToken } = require('../config/jwt');
const ApiResponse = require('../utils/apiResponse');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return ApiResponse.error(res, 'Access token is required. Please log in.', 401);
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Access token expired. Please refresh your token.', 401);
    }
    return ApiResponse.error(res, 'Invalid or corrupted access token.', 403);
  }
};

module.exports = { authenticateToken };
