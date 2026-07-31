const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Pre-hash password123 for demo user initializations
const defaultHash = bcrypt.hashSync('password123', 10);

// In-Memory Data Store (used as fallback or mock engine)
const mockStore = {
  roles: [
    { id: 1, name: 'Admin', description: 'Full administrative access' },
    { id: 2, name: 'Support Agent', description: 'Manages assigned tickets' },
    { id: 3, name: 'Customer', description: 'Creates and views support tickets' }
  ],
  categories: [
    { id: 1, name: 'Bug', description: 'Software defects, errors, or bugs', is_active: 1, created_at: new Date() },
    { id: 2, name: 'Payment', description: 'Billing issues and refunds', is_active: 1, created_at: new Date() },
    { id: 3, name: 'Login', description: 'Authentication and SSO issues', is_active: 1, created_at: new Date() },
    { id: 4, name: 'Account', description: 'Account settings and profile', is_active: 1, created_at: new Date() },
    { id: 5, name: 'Feature Request', description: 'New feature proposals', is_active: 1, created_at: new Date() },
    { id: 6, name: 'Technical Issue', description: 'API downtime or SDK bugs', is_active: 1, created_at: new Date() },
    { id: 7, name: 'Other', description: 'General inquiries', is_active: 1, created_at: new Date() }
  ],
  users: [
    { id: 1, name: 'Sarah Jenkins (Admin)', email: 'admin@supportinsights.com', password_hash: defaultHash, role_id: 1, avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bio: 'Platform Administrator', status: 'active', created_at: new Date() },
    { id: 2, name: 'David Chen (Agent)', email: 'david.chen@supportinsights.com', password_hash: defaultHash, role_id: 2, avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', bio: 'Senior Support Engineer', status: 'active', created_at: new Date() },
    { id: 3, name: 'Elena Rostova (Agent)', email: 'elena.rostova@supportinsights.com', password_hash: defaultHash, role_id: 2, avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bio: 'Payment Specialist', status: 'active', created_at: new Date() },
    { id: 4, name: 'Marcus Vance (Agent)', email: 'marcus.vance@supportinsights.com', password_hash: defaultHash, role_id: 2, avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bio: 'API Specialist', status: 'active', created_at: new Date() },
    { id: 5, name: 'Alice Johnson (Customer)', email: 'alice@acme.com', password_hash: defaultHash, role_id: 3, avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', bio: 'Product Manager', status: 'active', created_at: new Date() },
    { id: 6, name: 'Bob Smith (Customer)', email: 'bob@techflow.io', password_hash: defaultHash, role_id: 3, avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', bio: 'Lead Architect', status: 'active', created_at: new Date() },
    { id: 7, name: 'Carol White (Customer)', email: 'carol@innovate.co', password_hash: defaultHash, role_id: 3, avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', bio: 'CTO', status: 'active', created_at: new Date() }
  ],
  tickets: [
    {
      id: 1,
      ticket_code: 'TICK-1001',
      title: 'Unable to process monthly subscription payment via Visa',
      description: 'Our team attempted to upgrade our workspace plan to Enterprise using a Visa card ending in 4092, but received an generic 402 payment error.',
      category_id: 2,
      priority: 'High',
      status: 'Resolved',
      customer_id: 5,
      assigned_agent_id: 3,
      resolution_notes: 'Issue was identified as a temporary bank gateway timeout. Payment retried successfully.',
      first_responded_at: new Date(Date.now() - 4 * 86400000),
      resolved_at: new Date(Date.now() - 3 * 86400000),
      closed_at: new Date(Date.now() - 3 * 86400000),
      created_at: new Date(Date.now() - 5 * 86400000),
      updated_at: new Date(Date.now() - 3 * 86400000)
    },
    {
      id: 2,
      ticket_code: 'TICK-1002',
      title: 'OAuth2 SSO login fails for Okta users',
      description: 'Users attempting to log in via Okta SAML/OAuth2 are redirected to an infinite login loop with HTTP 401 response.',
      category_id: 3,
      priority: 'Critical',
      status: 'In Progress',
      customer_id: 6,
      assigned_agent_id: 2,
      resolution_notes: null,
      first_responded_at: new Date(Date.now() - 1 * 86400000),
      resolved_at: null,
      closed_at: null,
      created_at: new Date(Date.now() - 2 * 86400000),
      updated_at: new Date(Date.now() - 1 * 86400000)
    },
    {
      id: 3,
      ticket_code: 'TICK-1003',
      title: 'Export to CSV fails when filtering large dataset (>50k rows)',
      description: 'When exporting support analytics reports for Q2 with over 50k rows, the browser connection times out with 504 Gateway Timeout.',
      category_id: 1,
      priority: 'Medium',
      status: 'Assigned',
      customer_id: 7,
      assigned_agent_id: 4,
      resolution_notes: null,
      first_responded_at: new Date(Date.now() - 12 * 3600000),
      resolved_at: null,
      closed_at: null,
      created_at: new Date(Date.now() - 1 * 86400000),
      updated_at: new Date(Date.now() - 12 * 3600000)
    },
    {
      id: 4,
      ticket_code: 'TICK-1004',
      title: 'Add GraphQL API endpoint support for ticket webhooks',
      description: 'We would like to request GraphQL subscription support so we can stream ticket updates directly to our internal Slack bot.',
      category_id: 5,
      priority: 'Low',
      status: 'Open',
      customer_id: 5,
      assigned_agent_id: null,
      resolution_notes: null,
      first_responded_at: null,
      resolved_at: null,
      closed_at: null,
      created_at: new Date(Date.now() - 6 * 3600000),
      updated_at: new Date(Date.now() - 6 * 3600000)
    },
    {
      id: 5,
      ticket_code: 'TICK-1005',
      title: 'API Rate Limiter triggering false positive 429 on internal subnet',
      description: 'Our server IP 192.168.1.45 is getting rate limited despite being added to the whitelist configuration.',
      category_id: 6,
      priority: 'Critical',
      status: 'Resolved',
      customer_id: 6,
      assigned_agent_id: 4,
      resolution_notes: 'Updated subnet netmask configuration in environment policy file. Whitelist active.',
      first_responded_at: new Date(Date.now() - 2.5 * 86400000),
      resolved_at: new Date(Date.now() - 2 * 86400000),
      closed_at: new Date(Date.now() - 2 * 86400000),
      created_at: new Date(Date.now() - 3 * 86400000),
      updated_at: new Date(Date.now() - 2 * 86400000)
    }
  ],
  comments: [
    { id: 1, ticket_id: 1, user_id: 3, message: 'Hello Alice, I have looked into the payment gateway logs and identified a temporary bank authorization timeout.', is_internal: 0, created_at: new Date(Date.now() - 4.5 * 86400000) },
    { id: 2, ticket_id: 1, user_id: 5, message: 'Thanks Elena! We retried the transaction and it went through smoothly.', is_internal: 0, created_at: new Date(Date.now() - 4 * 86400000) },
    { id: 3, ticket_id: 2, user_id: 2, message: 'Marcus, checking Okta SAML certificate rotation. It seems the x509 cert expired yesterday.', is_internal: 1, created_at: new Date(Date.now() - 1.8 * 86400000) },
    { id: 4, ticket_id: 2, user_id: 2, message: 'Hi Bob, we are updating the SSO certificate metadata on our gateway now.', is_internal: 0, created_at: new Date(Date.now() - 1.5 * 86400000) }
  ],
  attachments: [],
  notifications: [
    { id: 1, user_id: 5, title: 'Ticket Resolved', message: 'Your ticket TICK-1001 has been marked as Resolved by Elena Rostova.', link: '/tickets/1', is_read: 1, created_at: new Date(Date.now() - 3 * 86400000) },
    { id: 2, user_id: 2, title: 'Ticket Assigned', message: 'You have been assigned to critical ticket TICK-1002 (OAuth2 SSO login fails).', link: '/tickets/2', is_read: 0, created_at: new Date(Date.now() - 2 * 86400000) },
    { id: 3, user_id: 6, title: 'New Comment on TICK-1002', message: 'David Chen posted an update on your support ticket.', link: '/tickets/2', is_read: 0, created_at: new Date(Date.now() - 1.5 * 86400000) }
  ],
  activity_logs: [
    { id: 1, user_id: 5, ticket_id: 1, action: 'TICKET_CREATED', details: 'Created ticket TICK-1001 with priority High', created_at: new Date(Date.now() - 5 * 86400000) },
    { id: 2, user_id: 1, ticket_id: 1, action: 'TICKET_ASSIGNED', details: 'Assigned ticket TICK-1001 to agent Elena Rostova', created_at: new Date(Date.now() - 4.9 * 86400000) },
    { id: 3, user_id: 3, ticket_id: 1, action: 'TICKET_STATUS_UPDATED', details: 'Updated status of TICK-1001 from In Progress to Resolved', created_at: new Date(Date.now() - 3 * 86400000) }
  ],
  refresh_tokens: [],
  password_reset_tokens: []
};

// Helper auto-increment ID generator
const getNextId = (list) => (list.length > 0 ? Math.max(...list.map(item => item.id)) + 1 : 1);

module.exports = {
  mockStore,
  getNextId
};
