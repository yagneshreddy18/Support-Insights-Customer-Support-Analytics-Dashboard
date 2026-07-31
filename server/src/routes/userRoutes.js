const express = require('express');
const { body } = require('express-validator');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('Admin'));

router.get('/', getUsers);
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('role_id').notEmpty().withMessage('Role ID required')
  ],
  validate,
  createUser
);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
