const ApiResponse = require('../utils/apiResponse');
const { mockStore, getNextId } = require('../models/store');

const getTickets = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      category_id,
      assigned_agent_id,
      customer_id,
      search,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    let tickets = [...mockStore.tickets];

    // Role-based scoping
    if (req.user.roleName === 'Customer') {
      tickets = tickets.filter(t => t.customer_id === req.user.id);
    } else if (req.user.roleName === 'Support Agent') {
      tickets = tickets.filter(t => t.assigned_agent_id === req.user.id);
    }

    // Apply filters
    if (status) {
      tickets = tickets.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }
    if (priority) {
      tickets = tickets.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    }
    if (category_id) {
      tickets = tickets.filter(t => t.category_id === parseInt(category_id, 10));
    }
    if (assigned_agent_id) {
      tickets = tickets.filter(t => t.assigned_agent_id === parseInt(assigned_agent_id, 10));
    }
    if (customer_id) {
      tickets = tickets.filter(t => t.customer_id === parseInt(customer_id, 10));
    }
    if (search) {
      const q = search.toLowerCase();
      tickets = tickets.filter(t => 
        t.ticket_code.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    tickets.sort((a, b) => {
      let valA = a[sort_by] || '';
      let valB = b[sort_by] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sort_order === 'asc' ? -1 : 1;
      if (valA > valB) return sort_order === 'asc' ? 1 : -1;
      return 0;
    });

    // Hydrate tickets with foreign relations (category, customer, agent)
    const hydrated = tickets.map(t => {
      const category = mockStore.categories.find(c => c.id === t.category_id);
      const customer = mockStore.users.find(u => u.id === t.customer_id);
      const agent = t.assigned_agent_id ? mockStore.users.find(u => u.id === t.assigned_agent_id) : null;
      return {
        ...t,
        category_name: category ? category.name : 'Unknown',
        customer_name: customer ? customer.name : 'Customer',
        customer_email: customer ? customer.email : '',
        assigned_agent_name: agent ? agent.name : 'Unassigned',
        assigned_agent_avatar: agent ? agent.avatar_url : null
      };
    });

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const total = hydrated.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedTickets = hydrated.slice(startIndex, startIndex + limitNum);

    return ApiResponse.success(res, 'Tickets retrieved successfully.', paginatedTickets, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages
    });
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = mockStore.tickets.find(t => t.id === parseInt(id, 10));

    if (!ticket) {
      return ApiResponse.error(res, 'Ticket not found.', 404);
    }

    // Role check
    if (req.user.roleName === 'Customer' && ticket.customer_id !== req.user.id) {
      return ApiResponse.error(res, 'Unauthorized access to this ticket.', 403);
    }

    const category = mockStore.categories.find(c => c.id === ticket.category_id);
    const customer = mockStore.users.find(u => u.id === ticket.customer_id);
    const agent = ticket.assigned_agent_id ? mockStore.users.find(u => u.id === ticket.assigned_agent_id) : null;

    const comments = mockStore.comments
      .filter(c => c.ticket_id === ticket.id)
      .filter(c => req.user.roleName !== 'Customer' || c.is_internal === 0)
      .map(c => {
        const u = mockStore.users.find(usr => usr.id === c.user_id);
        const roleObj = u ? mockStore.roles.find(r => r.id === u.role_id) : null;
        return {
          ...c,
          user_name: u ? u.name : 'User',
          user_avatar: u ? u.avatar_url : null,
          user_role: roleObj ? roleObj.name : 'Customer'
        };
      });

    const attachments = mockStore.attachments.filter(a => a.ticket_id === ticket.id);
    const activityLogs = mockStore.activity_logs.filter(al => al.ticket_id === ticket.id);

    const fullTicketData = {
      ...ticket,
      category_name: category ? category.name : 'Unknown',
      customer_name: customer ? customer.name : 'Customer',
      customer_email: customer ? customer.email : '',
      customer_avatar: customer ? customer.avatar_url : null,
      assigned_agent_name: agent ? agent.name : 'Unassigned',
      assigned_agent_email: agent ? agent.email : null,
      assigned_agent_avatar: agent ? agent.avatar_url : null,
      comments,
      attachments,
      activityLogs
    };

    return ApiResponse.success(res, 'Ticket details retrieved.', fullTicketData);
  } catch (error) {
    next(error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const { title, description, category_id, priority = 'Medium' } = req.body;
    const customerId = req.user.id;

    const ticketCode = `TICK-${1000 + getNextId(mockStore.tickets)}`;

    const newTicket = {
      id: getNextId(mockStore.tickets),
      ticket_code: ticketCode,
      title,
      description,
      category_id: parseInt(category_id, 10),
      priority,
      status: 'Open',
      customer_id: customerId,
      assigned_agent_id: null,
      resolution_notes: null,
      first_responded_at: null,
      resolved_at: null,
      closed_at: null,
      created_at: new Date(),
      updated_at: new Date()
    };

    mockStore.tickets.push(newTicket);

    // Create activity log
    mockStore.activity_logs.push({
      id: getNextId(mockStore.activity_logs),
      user_id: customerId,
      ticket_id: newTicket.id,
      action: 'TICKET_CREATED',
      details: `Ticket created with priority ${priority}`,
      created_at: new Date()
    });

    // Notify admins
    const admins = mockStore.users.filter(u => u.role_id === 1);
    admins.forEach(admin => {
      mockStore.notifications.push({
        id: getNextId(mockStore.notifications),
        user_id: admin.id,
        title: `New Ticket (${ticketCode})`,
        message: `${req.user.name} created ticket "${title}"`,
        link: `/tickets/${newTicket.id}`,
        is_read: 0,
        created_at: new Date()
      });
    });

    return ApiResponse.success(res, 'Support ticket created successfully!', newTicket, 201);
  } catch (error) {
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = mockStore.tickets.find(t => t.id === parseInt(id, 10));

    if (!ticket) return ApiResponse.error(res, 'Ticket not found.', 404);

    // Customer can only update title/description if status is Open or unassigned
    if (req.user.roleName === 'Customer') {
      if (ticket.customer_id !== req.user.id) return ApiResponse.error(res, 'Forbidden.', 403);
      if (ticket.status !== 'Open' && ticket.assigned_agent_id !== null) {
        return ApiResponse.error(res, 'Tickets cannot be edited after an agent has been assigned.', 400);
      }
    }

    const { title, description, category_id, priority, resolution_notes } = req.body;
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (category_id) ticket.category_id = parseInt(category_id, 10);
    if (priority && req.user.roleName !== 'Customer') ticket.priority = priority;
    if (resolution_notes !== undefined) ticket.resolution_notes = resolution_notes;

    ticket.updated_at = new Date();

    return ApiResponse.success(res, 'Ticket updated successfully.', ticket);
  } catch (error) {
    next(error);
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = mockStore.tickets.findIndex(t => t.id === parseInt(id, 10));
    if (idx === -1) return ApiResponse.error(res, 'Ticket not found.', 404);

    mockStore.tickets.splice(idx, 1);

    return ApiResponse.success(res, 'Ticket deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const assignTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assigned_agent_id } = req.body;

    const ticket = mockStore.tickets.find(t => t.id === parseInt(id, 10));
    if (!ticket) return ApiResponse.error(res, 'Ticket not found.', 404);

    const agent = mockStore.users.find(u => u.id === parseInt(assigned_agent_id, 10));
    if (!agent || agent.role_id !== 2) {
      return ApiResponse.error(res, 'Target user is not a valid Support Agent.', 400);
    }

    ticket.assigned_agent_id = agent.id;
    if (ticket.status === 'Open') {
      ticket.status = 'Assigned';
    }
    ticket.updated_at = new Date();

    // Log & notify
    mockStore.activity_logs.push({
      id: getNextId(mockStore.activity_logs),
      user_id: req.user.id,
      ticket_id: ticket.id,
      action: 'TICKET_ASSIGNED',
      details: `Assigned to ${agent.name}`,
      created_at: new Date()
    });

    mockStore.notifications.push({
      id: getNextId(mockStore.notifications),
      user_id: agent.id,
      title: 'New Ticket Assigned',
      message: `You have been assigned to ticket ${ticket.ticket_code}`,
      link: `/tickets/${ticket.id}`,
      is_read: 0,
      created_at: new Date()
    });

    return ApiResponse.success(res, `Ticket ${ticket.ticket_code} assigned to agent ${agent.name}.`, ticket);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolution_notes } = req.body;

    const ticket = mockStore.tickets.find(t => t.id === parseInt(id, 10));
    if (!ticket) return ApiResponse.error(res, 'Ticket not found.', 404);

    const prevStatus = ticket.status;
    ticket.status = status;
    if (resolution_notes) ticket.resolution_notes = resolution_notes;

    const now = new Date();
    if (!ticket.first_responded_at) ticket.first_responded_at = now;

    if (status === 'Resolved') {
      ticket.resolved_at = now;
    } else if (status === 'Closed') {
      ticket.closed_at = now;
    }

    ticket.updated_at = now;

    // Log
    mockStore.activity_logs.push({
      id: getNextId(mockStore.activity_logs),
      user_id: req.user.id,
      ticket_id: ticket.id,
      action: 'STATUS_CHANGED',
      details: `Status changed from ${prevStatus} to ${status}`,
      created_at: now
    });

    // Notify customer
    mockStore.notifications.push({
      id: getNextId(mockStore.notifications),
      user_id: ticket.customer_id,
      title: `Ticket Status Updated (${ticket.ticket_code})`,
      message: `Status set to ${status}`,
      link: `/tickets/${ticket.id}`,
      is_read: 0,
      created_at: now
    });

    return ApiResponse.success(res, `Ticket status updated to ${status}.`, ticket);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, is_internal = 0 } = req.body;

    const ticket = mockStore.tickets.find(t => t.id === parseInt(id, 10));
    if (!ticket) return ApiResponse.error(res, 'Ticket not found.', 404);

    const now = new Date();
    if (!ticket.first_responded_at && req.user.roleName !== 'Customer') {
      ticket.first_responded_at = now;
    }

    const newComment = {
      id: getNextId(mockStore.comments),
      ticket_id: ticket.id,
      user_id: req.user.id,
      message,
      is_internal: req.user.roleName === 'Customer' ? 0 : is_internal ? 1 : 0,
      created_at: now,
      updated_at: now
    };

    mockStore.comments.push(newComment);

    // Notify counterpart
    const targetUserId = req.user.roleName === 'Customer' ? (ticket.assigned_agent_id || 1) : ticket.customer_id;
    mockStore.notifications.push({
      id: getNextId(mockStore.notifications),
      user_id: targetUserId,
      title: `New Comment on ${ticket.ticket_code}`,
      message: `${req.user.name}: "${message.substring(0, 50)}..."`,
      link: `/tickets/${ticket.id}`,
      is_read: 0,
      created_at: now
    });

    const userObj = mockStore.users.find(u => u.id === req.user.id);
    const roleObj = userObj ? mockStore.roles.find(r => r.id === userObj.role_id) : null;

    const hydratedComment = {
      ...newComment,
      user_name: userObj ? userObj.name : req.user.name,
      user_avatar: userObj ? userObj.avatar_url : null,
      user_role: roleObj ? roleObj.name : req.user.roleName
    };

    return ApiResponse.success(res, 'Comment posted successfully.', hydratedComment, 201);
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = mockStore.tickets.find(t => t.id === parseInt(id, 10));
    if (!ticket) return ApiResponse.error(res, 'Ticket not found.', 404);

    const comments = mockStore.comments
      .filter(c => c.ticket_id === ticket.id)
      .filter(c => req.user.roleName !== 'Customer' || c.is_internal === 0)
      .map(c => {
        const u = mockStore.users.find(usr => usr.id === c.user_id);
        const roleObj = u ? mockStore.roles.find(r => r.id === u.role_id) : null;
        return {
          ...c,
          user_name: u ? u.name : 'User',
          user_avatar: u ? u.avatar_url : null,
          user_role: roleObj ? roleObj.name : 'Customer'
        };
      });

    return ApiResponse.success(res, 'Comments retrieved.', comments);
  } catch (error) {
    next(error);
  }
};

const uploadAttachment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = mockStore.tickets.find(t => t.id === parseInt(id, 10));
    if (!ticket) return ApiResponse.error(res, 'Ticket not found.', 404);

    if (!req.file) {
      return ApiResponse.error(res, 'No file uploaded.', 400);
    }

    const newAttachment = {
      id: getNextId(mockStore.attachments),
      ticket_id: ticket.id,
      comment_id: req.body.comment_id ? parseInt(req.body.comment_id, 10) : null,
      file_name: req.file.originalname,
      file_path: `/uploads/${req.file.filename}`,
      file_type: req.file.mimetype,
      file_size: req.file.size,
      uploaded_by: req.user.id,
      created_at: new Date()
    };

    mockStore.attachments.push(newAttachment);

    return ApiResponse.success(res, 'Attachment uploaded successfully.', newAttachment, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
