const ApiResponse = require('../utils/apiResponse');
const { mockStore } = require('../models/store');

const getOverview = async (req, res, next) => {
  try {
    const tickets = mockStore.tickets;
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const assignedTickets = tickets.filter(t => t.status === 'Assigned').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;
    const closedTickets = tickets.filter(t => t.status === 'Closed').length;
    const criticalTickets = tickets.filter(t => t.priority === 'Critical').length;

    // Avg resolution time (hrs)
    const resolved = tickets.filter(t => t.resolved_at && t.created_at);
    let totalResHours = 0;
    resolved.forEach(t => {
      totalResHours += (new Date(t.resolved_at) - new Date(t.created_at)) / (1000 * 3600);
    });
    const avgResolutionTime = resolved.length > 0 ? (totalResHours / resolved.length).toFixed(1) : 4.2;

    // Avg first response time (mins)
    const responded = tickets.filter(t => t.first_responded_at && t.created_at);
    let totalRespMins = 0;
    responded.forEach(t => {
      totalRespMins += (new Date(t.first_responded_at) - new Date(t.created_at)) / (1000 * 60);
    });
    const avgFirstResponseTime = responded.length > 0 ? (totalRespMins / responded.length).toFixed(0) : 38;

    return ApiResponse.success(res, 'Analytics overview retrieved.', {
      totalTickets,
      openTickets,
      assignedTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      criticalTickets,
      avgResolutionTimeHours: parseFloat(avgResolutionTime),
      avgFirstResponseTimeMinutes: parseFloat(avgFirstResponseTime),
      slaComplianceRate: 94.5,
      resolvedVsPendingRatio: `${resolvedTickets}:${openTickets + assignedTickets + inProgressTickets}`
    });
  } catch (error) {
    next(error);
  }
};

const getStatusDistribution = async (req, res, next) => {
  try {
    const statuses = ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'];
    const total = mockStore.tickets.length || 1;

    const data = statuses.map(status => {
      const count = mockStore.tickets.filter(t => t.status === status).length;
      return {
        status,
        count,
        percentage: parseFloat(((count / total) * 100).toFixed(1))
      };
    });

    return ApiResponse.success(res, 'Status distribution retrieved.', data);
  } catch (error) {
    next(error);
  }
};

const getCategoryDistribution = async (req, res, next) => {
  try {
    const data = mockStore.categories.map(cat => {
      const catTickets = mockStore.tickets.filter(t => t.category_id === cat.id);
      const resolved = catTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
      return {
        category_id: cat.id,
        category_name: cat.name,
        count: catTickets.length,
        resolvedCount: resolved
      };
    });

    return ApiResponse.success(res, 'Category distribution retrieved.', data);
  } catch (error) {
    next(error);
  }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    // Generate 6 months of trend data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const data = months.map((month, idx) => ({
      month,
      created: 12 + idx * 4 + (idx % 2 === 0 ? 5 : -2),
      resolved: 10 + idx * 4 + (idx % 3 === 0 ? 4 : 1),
      critical: Math.max(1, (idx * 2) % 5)
    }));

    return ApiResponse.success(res, 'Monthly trends retrieved.', data);
  } catch (error) {
    next(error);
  }
};

const getEmployeePerformance = async (req, res, next) => {
  try {
    const agents = mockStore.users.filter(u => u.role_id === 2);
    const data = agents.map(agent => {
      const assigned = mockStore.tickets.filter(t => t.assigned_agent_id === agent.id);
      const resolved = assigned.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
      const inProgress = assigned.filter(t => t.status === 'In Progress').length;
      const rate = assigned.length > 0 ? ((resolved / assigned.length) * 100).toFixed(1) : 100.0;

      return {
        agent_id: agent.id,
        agent_name: agent.name,
        avatar_url: agent.avatar_url,
        assigned_tickets: assigned.length,
        resolved_tickets: resolved,
        in_progress_tickets: inProgress,
        resolution_rate: parseFloat(rate),
        avg_resolution_hrs: (2.5 + (agent.id * 0.7)).toFixed(1)
      };
    });

    return ApiResponse.success(res, 'Employee performance leaderboard retrieved.', data);
  } catch (error) {
    next(error);
  }
};

const exportReports = async (req, res, next) => {
  try {
    const header = 'Ticket Code,Title,Category,Priority,Status,Customer,Agent,Created At\n';
    const rows = mockStore.tickets.map(t => {
      const cat = mockStore.categories.find(c => c.id === t.category_id);
      const cust = mockStore.users.find(u => u.id === t.customer_id);
      const agent = t.assigned_agent_id ? mockStore.users.find(u => u.id === t.assigned_agent_id) : null;
      return `"${t.ticket_code}","${t.title.replace(/"/g, '""')}","${cat ? cat.name : ''}","${t.priority}","${t.status}","${cust ? cust.name : ''}","${agent ? agent.name : 'Unassigned'}","${t.created_at.toISOString()}"`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="support_insights_report.csv"');
    return res.status(200).send(header + rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getStatusDistribution,
  getCategoryDistribution,
  getMonthlyTrends,
  getEmployeePerformance,
  exportReports
};
