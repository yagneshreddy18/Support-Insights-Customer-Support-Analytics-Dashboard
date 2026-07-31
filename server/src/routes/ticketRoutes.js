const express = require('express');
const { body } = require('express-validator');
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  updateStatus,
  addComment,
  getComments,
  uploadAttachment
} = require('../controllers/ticketController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const upload = require('../config/multer');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getTickets);
router.get('/:id', getTicketById);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Ticket title is required'),
    body('description').trim().notEmpty().withMessage('Ticket description is required'),
    body('category_id').notEmpty().withMessage('Category selection is required')
  ],
  validate,
  createTicket
);

router.put('/:id', updateTicket);
router.delete('/:id', authorizeRoles('Admin'), deleteTicket);

router.put(
  '/:id/assign',
  authorizeRoles('Admin'),
  [body('assigned_agent_id').notEmpty().withMessage('Agent ID is required')],
  validate,
  assignTicket
);

router.put(
  '/:id/status',
  authorizeRoles('Admin', 'Support Agent'),
  [body('status').isIn(['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected']).withMessage('Valid status required')],
  validate,
  updateStatus
);

router.get('/:id/comments', getComments);
router.post(
  '/:id/comments',
  [body('message').trim().notEmpty().withMessage('Comment text cannot be empty')],
  validate,
  addComment
);

router.post(
  '/:id/attachments',
  upload.single('file'),
  uploadAttachment
);

module.exports = router;
