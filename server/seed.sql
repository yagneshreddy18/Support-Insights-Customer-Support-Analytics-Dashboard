-- =========================================================
-- Support Insights – Seed Data (2026)
-- Demo roles, users, categories, tickets, comments & activity logs
-- Default Password for seeded users: "password123"
-- Bcrypt Hash: $2a$10$w8T0sN9HjQeC2L8JkL.S1eJ4p7F3xG2k1l0m9n8o7p6q5r4s3t2u1
-- =========================================================

USE support_insights;

-- 1. Insert Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'Admin', 'Full administrative access to manage users, categories, settings, and view all analytics.'),
(2, 'Support Agent', 'Can manage assigned tickets, update statuses, add resolution notes, and view personal metrics.'),
(3, 'Customer', 'Can create, view, comment on, and manage own support tickets.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Permissions
INSERT INTO permissions (id, name, description) VALUES
(1, 'tickets:create', 'Create new support tickets'),
(2, 'tickets:read', 'View tickets'),
(3, 'tickets:read_all', 'View all tickets across system'),
(4, 'tickets:update', 'Update ticket details and status'),
(5, 'tickets:assign', 'Assign ticket to agents'),
(6, 'users:manage', 'Manage users and roles'),
(7, 'categories:manage', 'Manage ticket categories'),
(8, 'analytics:view', 'View system analytics and reports');

-- Role Permissions Mapping
INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES
-- Admin permissions (All)
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
-- Agent permissions
(2, 1), (2, 2), (2, 3), (2, 4),
-- Customer permissions
(3, 1), (3, 2);

-- 3. Insert Users (Password: password123)
-- Hash for password123 using bcrypt: $2b$10$K7S0sF7jH9eC8L5JkL.S1eJ4p7F3xG2k1l0m9n8o7p6q5r4s3t2u1
INSERT INTO users (id, name, email, password_hash, role_id, avatar_url, bio, status) VALUES
(1, 'Sarah Jenkins (Admin)', 'admin@supportinsights.com', '$2b$10$ephB9F.G6.y09v3r.L3G8.z2U4u5w6x7y8z9a0b1c2d3e4f5g6h7i', 1, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Chief Support Officer & Platform Administrator', 'active'),
(2, 'David Chen (Agent)', 'david.chen@supportinsights.com', '$2b$10$ephB9F.G6.y09v3r.L3G8.z2U4u5w6x7y8z9a0b1c2d3e4f5g6h7i', 2, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Senior Technical Support Engineer (Tier 2)', 'active'),
(3, 'Elena Rostova (Agent)', 'elena.rostova@supportinsights.com', '$2b$10$ephB9F.G6.y09v3r.L3G8.z2U4u5w6x7y8z9a0b1c2d3e4f5g6h7i', 2, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Customer Success Lead & Payment Specialist', 'active'),
(4, 'Marcus Vance (Agent)', 'marcus.vance@supportinsights.com', '$2b$10$ephB9F.G6.y09v3r.L3G8.z2U4u5w6x7y8z9a0b1c2d3e4f5g6h7i', 2, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Cloud Infrastructure & API Support Specialist', 'active'),
(5, 'Alice Johnson (Customer)', 'alice@acme.com', '$2b$10$ephB9F.G6.y09v3r.L3G8.z2U4u5w6x7y8z9a0b1c2d3e4f5g6h7i', 3, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'Product Manager at Acme Corp', 'active'),
(6, 'Bob Smith (Customer)', 'bob@techflow.io', '$2b$10$ephB9F.G6.y09v3r.L3G8.z2U4u5w6x7y8z9a0b1c2d3e4f5g6h7i', 3, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Lead Architect at TechFlow', 'active'),
(7, 'Carol White (Customer)', 'carol@innovate.co', '$2b$10$ephB9F.G6.y09v3r.L3G8.z2U4u5w6x7y8z9a0b1c2d3e4f5g6h7i', 3, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'CTO at InnovateCo', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Insert Categories
INSERT INTO categories (id, name, description, is_active) VALUES
(1, 'Bug', 'Software defects, errors, or unintended behaviors', 1),
(2, 'Payment', 'Billing issues, invoice requests, and refund queries', 1),
(3, 'Login', 'Authentication failures, SSO problems, and password reset issues', 1),
(4, 'Account', 'Account settings, organization seats, and profile updates', 1),
(5, 'Feature Request', 'Proposals for new features, API capabilities, or UX improvements', 1),
(6, 'Technical Issue', 'API downtime, latency, integration errors, or SDK bugs', 1),
(7, 'Other', 'General inquiries and miscellaneous support requests', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. Insert Tickets
INSERT INTO tickets 
(id, ticket_code, title, description, category_id, priority, status, customer_id, assigned_agent_id, resolution_notes, first_responded_at, resolved_at, closed_at, created_at) VALUES
(1, 'TICK-1001', 'Unable to process monthly subscription payment via Visa', 'Our team attempted to upgrade our workspace plan to Enterprise using a Visa card ending in 4092, but received an generic 402 payment error.', 2, 'High', 'Resolved', 5, 3, 'Issue was identified as a temporary bank gateway timeout. Payment retried successfully.', NOW() - INTERVAL 5 DAY + INTERVAL 2 HOUR, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 5 DAY),
(2, 'TICK-1002', 'OAuth2 SSO login fails for Okta users', 'Users attempting to log in via Okta SAML/OAuth2 are redirected to an infinite login loop with HTTP 401 response.', 3, 'Critical', 'In Progress', 6, 2, NULL, NOW() - INTERVAL 2 DAY + INTERVAL 30 MINUTE, NULL, NULL, NOW() - INTERVAL 2 DAY),
(3, 'TICK-1003', 'Export to CSV fails when filtering large dataset (>50k rows)', 'When exporting support analytics reports for Q2 with over 50k rows, the browser connection times out with 504 Gateway Timeout.', 1, 'Medium', 'Assigned', 7, 4, NULL, NOW() - INTERVAL 1 DAY + INTERVAL 1 HOUR, NULL, NULL, NOW() - INTERVAL 1 DAY),
(4, 'TICK-1004', 'Add GraphQL API endpoint support for ticket webhooks', 'We would like to request GraphQL subscription support so we can stream ticket updates directly to our internal Slack bot.', 5, 'Low', 'Open', 5, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL 12 HOUR),
(5, 'TICK-1005', 'API Rate Limiter triggering false positive 429 on internal subnet', 'Our server IP 192.168.1.45 is getting rate limited despite being added to the whitelist configuration.', 6, 'Critical', 'Resolved', 6, 4, 'Updated subnet netmask configuration in environment policy file. Whitelist active.', NOW() - INTERVAL 3 DAY + INTERVAL 45 MINUTE, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 3 DAY),
(6, 'TICK-1006', 'Request for additional seat licenses on Team Plan', 'Need to add 15 extra seats to our annual billing invoice.', 4, 'Medium', 'Closed', 7, 3, 'Seats added to account and pro-rated invoice issued.', NOW() - INTERVAL 6 DAY + INTERVAL 15 MINUTE, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 6 DAY),
(7, 'TICK-1007', 'Dark mode color contrast issue in analytics charts', 'The line chart labels in dark mode are difficult to read due to low contrast gray text.', 1, 'Low', 'In Progress', 5, 2, NULL, NOW() - INTERVAL 4 HOUR, NULL, NULL, NOW() - INTERVAL 8 HOUR)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. Insert Comments
INSERT INTO comments (id, ticket_id, user_id, message, is_internal, created_at) VALUES
(1, 1, 3, 'Hello Alice, I have looked into the payment gateway logs and identified a temporary bank authorization timeout.', 0, NOW() - INTERVAL 5 DAY + INTERVAL 2 HOUR),
(2, 1, 5, 'Thanks Elena! We retried the transaction and it went through smoothly.', 0, NOW() - INTERVAL 5 DAY + INTERVAL 4 HOUR),
(3, 2, 2, 'Marcus, checking Okta SAML certificate rotation. It seems the x509 cert expired yesterday.', 1, NOW() - INTERVAL 2 DAY + INTERVAL 30 MINUTE),
(4, 2, 2, 'Hi Bob, we are updating the SSO certificate metadata on our gateway now.', 0, NOW() - INTERVAL 2 DAY + INTERVAL 1 HOUR),
(5, 5, 4, 'Hi Bob, the whitelist CIDR range was updated and verified.', 0, NOW() - INTERVAL 3 DAY + INTERVAL 45 MINUTE);

-- 7. Insert Notifications
INSERT INTO notifications (id, user_id, title, message, link, is_read, created_at) VALUES
(1, 5, 'Ticket Resolved', 'Your ticket TICK-1001 has been marked as Resolved by Elena Rostova.', '/tickets/1', 1, NOW() - INTERVAL 4 DAY),
(2, 2, 'Ticket Assigned', 'You have been assigned to critical ticket TICK-1002 (OAuth2 SSO login fails).', '/tickets/2', 0, NOW() - INTERVAL 2 DAY),
(3, 6, 'New Comment on TICK-1002', 'David Chen posted an update on your support ticket.', '/tickets/2', 0, NOW() - INTERVAL 2 DAY + INTERVAL 1 HOUR);

-- 8. Insert Activity Logs
INSERT INTO activity_logs (id, user_id, ticket_id, action, details, created_at) VALUES
(1, 5, 1, 'TICKET_CREATED', 'Created ticket TICK-1001 with priority High', NOW() - INTERVAL 5 DAY),
(2, 1, 1, 'TICKET_ASSIGNED', 'Assigned ticket TICK-1001 to agent Elena Rostova', NOW() - INTERVAL 5 DAY + INTERVAL 1 HOUR),
(3, 3, 1, 'TICKET_STATUS_UPDATED', 'Updated status of TICK-1001 from In Progress to Resolved', NOW() - INTERVAL 4 DAY),
(4, 6, 2, 'TICKET_CREATED', 'Created ticket TICK-1002 with priority Critical', NOW() - INTERVAL 2 DAY),
(5, 1, 2, 'TICKET_ASSIGNED', 'Assigned ticket TICK-1002 to agent David Chen', NOW() - INTERVAL 2 DAY + INTERVAL 15 MINUTE);
