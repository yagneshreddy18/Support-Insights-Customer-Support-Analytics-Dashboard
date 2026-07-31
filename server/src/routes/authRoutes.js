const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  refreshTokenHandler,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email address is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email address is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

router.post('/refresh-token', refreshTokenHandler);
router.post('/logout', logout);

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email address is required')],
  validate,
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  validate,
  resetPassword
);

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
