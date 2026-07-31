const express = require('express');
const { body } = require('express-validator');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getCategories);
router.post(
  '/',
  authorizeRoles('Admin'),
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  validate,
  createCategory
);
router.put('/:id', authorizeRoles('Admin'), updateCategory);
router.delete('/:id', authorizeRoles('Admin'), deleteCategory);

module.exports = router;
