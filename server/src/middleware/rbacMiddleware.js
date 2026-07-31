const ApiResponse = require('../utils/apiResponse');

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Unauthenticated user context.', 401);
    }

    const userRole = req.user.roleName;

    if (!allowedRoles.includes(userRole)) {
      return ApiResponse.error(
        res,
        `Forbidden: Role '${userRole}' does not have permission to access this resource. Required: [${allowedRoles.join(', ')}]`,
        403
      );
    }

    next();
  };
};

module.exports = { authorizeRoles };
