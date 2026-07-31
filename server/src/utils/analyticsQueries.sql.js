// Optimized SQL Analytics Queries

const analyticsQueries = {
  // 1. Overview KPIs
  overviewKPIs: `
    SELECT 
      COUNT(*) AS total_tickets,
      SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS open_tickets,
      SUM(CASE WHEN status = 'Assigned' THEN 1 ELSE 0 END) AS assigned_tickets,
      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_tickets,
      SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_tickets,
      SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS closed_tickets,
      SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejected_tickets,
      SUM(CASE WHEN priority = 'Critical' THEN 1 ELSE 0 END) AS critical_tickets,
      ROUND(AVG(CASE WHEN resolved_at IS NOT NULL THEN TIMESTAMPDIFF(HOUR, created_at, resolved_at) END), 1) AS avg_resolution_hours,
      ROUND(AVG(CASE WHEN first_responded_at IS NOT NULL THEN TIMESTAMPDIFF(MINUTE, created_at, first_responded_at) END), 1) AS avg_first_response_minutes
    FROM tickets;
  `,

  // 2. Tickets by Status
  ticketsByStatus: `
    SELECT 
      status, 
      COUNT(*) AS count,
      ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tickets)), 1) AS percentage
    FROM tickets
    GROUP BY status
    ORDER BY count DESC;
  `,

  // 3. Tickets by Priority
  ticketsByPriority: `
    SELECT 
      priority, 
      COUNT(*) AS count
    FROM tickets
    GROUP BY priority
    ORDER BY FIELD(priority, 'Critical', 'High', 'Medium', 'Low');
  `,

  // 4. Tickets by Category
  ticketsByCategory: `
    SELECT 
      c.name AS category_name, 
      COUNT(t.id) AS ticket_count,
      SUM(CASE WHEN t.status IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) AS resolved_count
    FROM categories c
    LEFT JOIN tickets t ON c.id = t.category_id
    GROUP BY c.id, c.name
    ORDER BY ticket_count DESC;
  `,

  // 5. Monthly Ticket Trends
  ticketsMonthly: `
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m') AS month,
      COUNT(*) AS total,
      SUM(CASE WHEN status IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) AS resolved,
      SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS open
    FROM tickets
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month ASC;
  `,

  // 6. Employee/Agent Performance Leaderboard
  employeePerformance: `
    SELECT 
      u.id AS agent_id,
      u.name AS agent_name,
      u.avatar_url,
      COUNT(t.id) AS assigned_tickets,
      SUM(CASE WHEN t.status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_tickets,
      SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_tickets,
      ROUND(AVG(CASE WHEN t.resolved_at IS NOT NULL THEN TIMESTAMPDIFF(HOUR, t.created_at, t.resolved_at) END), 1) AS avg_resolution_time_hrs,
      ROUND(SUM(CASE WHEN t.status IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(t.id), 0), 1) AS resolution_rate
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    LEFT JOIN tickets t ON u.id = t.assigned_agent_id
    WHERE r.name = 'Support Agent'
    GROUP BY u.id, u.name, u.avatar_url
    ORDER BY resolved_tickets DESC;
  `,

  // 7. SLA Compliance & Backlog Analysis CTE Query
  slaAndBacklog: `
    WITH TicketMetrics AS (
      SELECT 
        id,
        priority,
        status,
        created_at,
        resolved_at,
        first_responded_at,
        TIMESTAMPDIFF(HOUR, created_at, COALESCE(resolved_at, NOW())) AS duration_hours,
        CASE 
          WHEN priority = 'Critical' AND TIMESTAMPDIFF(HOUR, created_at, COALESCE(resolved_at, NOW())) <= 4 THEN 1
          WHEN priority = 'High' AND TIMESTAMPDIFF(HOUR, created_at, COALESCE(resolved_at, NOW())) <= 24 THEN 1
          WHEN priority = 'Medium' AND TIMESTAMPDIFF(HOUR, created_at, COALESCE(resolved_at, NOW())) <= 48 THEN 1
          WHEN priority = 'Low' AND TIMESTAMPDIFF(HOUR, created_at, COALESCE(resolved_at, NOW())) <= 72 THEN 1
          ELSE 0
        END AS is_sla_compliant
      FROM tickets
    )
    SELECT 
      COUNT(*) AS total_evaluated,
      SUM(is_sla_compliant) AS sla_met_count,
      ROUND((SUM(is_sla_compliant) * 100.0 / COUNT(*)), 1) AS sla_compliance_percentage,
      SUM(CASE WHEN status IN ('Open', 'Assigned', 'In Progress') THEN 1 ELSE 0 END) AS active_backlog
    FROM TicketMetrics;
  `
};

module.exports = analyticsQueries;
