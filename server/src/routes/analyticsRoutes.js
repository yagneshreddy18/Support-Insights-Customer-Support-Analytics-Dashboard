const express = require('express');
const {
  getOverview,
  getStatusDistribution,
  getCategoryDistribution,
  getMonthlyTrends,
  getEmployeePerformance,
  exportReports
} = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('Admin', 'Support Agent'));

router.get('/overview', getOverview);
router.get('/status', getStatusDistribution);
router.get('/category', getCategoryDistribution);
router.get('/monthly', getMonthlyTrends);
router.get('/employees', getEmployeePerformance);
router.get('/export', authorizeRoles('Admin'), exportReports);

module.exports = router;
