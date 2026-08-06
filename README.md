# Support Insights – Customer Support Analytics Dashboard (2026)

[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20Node.js%20%7C%20Express%20%7C%20MySQL%20%7C%20TailwindCSS-blue.svg)](#tech-stack)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](#license)
[![Docker Support](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker)](#docker-deployment)

**Support Insights** is a production-ready, full-stack customer support ticket management system and real-time SQL analytics dashboard. Designed with clean architecture, strict role-based access control (RBAC), normalized database schema, and responsive UI components.

---

## 🌟 Key Features

### 1. Multi-Role User Workspaces
- **Customer**: Register, login, create support tickets, track ticket status, reply in conversation threads, upload screenshot attachments, edit tickets prior to agent assignment, and receive instant notifications.
- **Support Agent**: View assigned queue, update ticket lifecycle statuses (`Open` → `Assigned` → `In Progress` → `Resolved` → `Closed` / `Rejected`), log internal private notes, add resolution summaries, and monitor personal performance metrics.
- **Administrator**: Comprehensive dashboard, user management (assign roles & create support engineers), category CRUD management, system-wide ticket assignment, high-priority SLA tracking, and CSV analytical report exports.

### 2. SQL Analytics Engine & SLA Reporting
- **Real-Time KPIs**: Total volume, active backlog, critical tickets count, average resolution duration (hrs), and average first response time (mins).
- **Interactive Visualizations**: Powered by `Recharts` (Monthly ticket trends, Category load pie chart, Priority distribution bars, and Support Agent comparative performance leaderboard).
- **Optimized SQL Queries**: Built with Common Table Expressions (CTEs), `TIMESTAMPDIFF`, `CASE WHEN` conditional aggregations, and indexed foreign key joins.

### 3. Enterprise Security & Architecture
- **Authentication**: Dual-token JWT (Access Token + Refresh Token rotation) with bcrypt password hashing.
- **Security Middleware**: `helmet` header hardening, `cors` cross-origin control, `express-rate-limit` brute-force protection, and `express-validator` request sanitization.
- **File Uploads**: `multer` storage abstraction for ticket screenshots, PDFs, and documents.

---

## 🛠 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite) | Single Page Application framework |
| **Styling** | Tailwind CSS v3 | Dark/Light mode theme tokens & utility classes |
| **Charts** | Recharts | Responsive SVG charts & analytics rendering |
| **Routing** | React Router v6 | Client-side routing with role-based guards |
| **State/Forms** | React Context API & React Hook Form | Global state management & validated forms |
| **Backend** | Node.js & Express.js | Modular RESTful API server |
| **Database** | MySQL 8.0 | Fully normalized relational database |
| **Security** | JWT, bcryptjs, Helmet, Rate Limiter | Token authorization & security headers |
| **DevOps** | Docker & Docker Compose | Multi-container orchestrated environment |

---

## 📁 Repository Structure

```
.
├── docker-compose.yml              # Multi-container Docker orchestration
├── postman_collection.json         # Postman API Collection
├── README.md                       # Comprehensive documentation
├── server/
│   ├── Dockerfile
│   ├── package.json
│   ├── schema.sql                  # Normalized MySQL DDL schema
│   ├── seed.sql                    # Initial seed data script
│   ├── .env.example
│   └── src/
│       ├── config/                 # Database, JWT, and Multer configs
│       ├── controllers/            # API Controllers (Auth, Ticket, User, Category, Analytics)
│       ├── middleware/             # Auth, RBAC, Validation, Rate Limiter, Error Handlers
│       ├── models/                 # Store & data access repository layer
│       ├── routes/                 # Express router definitions
│       └── utils/                  # Logger, API response helper, SQL queries
└── client/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── api/                    # Axios client instances & API wrappers
        ├── components/             # Common UI badges, modals, skeletons, navbar, sidebar, charts
        ├── context/                # AuthContext, ThemeContext, NotificationContext
        ├── layouts/                # MainLayout & AuthLayout wrappers
        ├── pages/                  # Landing, Login, Register, Dashboards, Ticket Queue, Analytics
        └── utils/                  # Date formatters & status constants
```

---

## 🗄 Database Architecture & ER Schema

The database consists of **12 normalized tables** with explicit foreign keys, cascade rules, and indexes:

1. `roles`: Role definitions (Admin, Support Agent, Customer).
2. `permissions` & `role_permissions`: Granular privilege junction mappings.
3. `users`: User profiles with `role_id` foreign key, avatar, bio, and status.
4. `categories`: Support categories (Bug, Payment, Login, Account, Feature Request, Technical Issue, Other).
5. `tickets`: Ticket records with `customer_id`, `assigned_agent_id`, `category_id`, status, priority, timestamps (`first_responded_at`, `resolved_at`, `closed_at`).
6. `comments`: Conversation thread with `is_internal` flag for private support notes.
7. `attachments`: Uploaded media attachments linked to tickets.
8. `notifications`: User notifications & unread state counters.
9. `activity_logs`: Audit trail logging system events and status transitions.
10. `refresh_tokens` & `password_reset_tokens`: Security tokens lifecycle management.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MySQL Server (v8.0+) OR Docker

### Option A: Local Development Run

1. **Clone & Setup Backend**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```
2. **Setup Database**:
   Import `server/schema.sql` and `server/seed.sql` into your local MySQL server:
   ```bash
   mysql -u root -p < server/schema.sql
   mysql -u root -p < server/seed.sql
   ```
3. **Start Backend Server**:
   ```bash
   npm run dev
   # API running at http://localhost:5000/api/v1
   ```
4. **Setup & Start Frontend Client**:
   ```bash
   cd ../client
   npm install
   npm run dev
   # Application running at http://localhost:5173
   ```

### Option B: One-Command Docker Setup

```bash
docker-compose up --build
```
This automatically boots up MySQL 8, seeds the database, and launches both Backend (`http://localhost:5000`) and Frontend (`http://localhost:5173`).

---

## 🔑 Pre-Seeded Demo Credentials

All seeded user accounts share the default password: **`password123`**

| Role | Email Address | Description |
| :--- | :--- | :--- |
| **Admin** | `admin@supportinsights.com` | Full administrative & analytics access |
| **Support Agent** | `david.chen@supportinsights.com` | Technical Support Engineer |
| **Support Agent** | `elena.rostova@supportinsights.com` | Payment & Success Lead |
| **Customer** | `alice@acme.com` | Customer account (Acme Corp) |
| **Customer** | `bob@techflow.io` | Customer account (TechFlow) |

---

## 📡 REST API Documentation

### Auth APIs
- `POST /api/v1/auth/register` - Create new user account
- `POST /api/v1/auth/login` - Authenticate & obtain JWT tokens
- `POST /api/v1/auth/refresh-token` - Refresh expired access token
- `POST /api/v1/auth/logout` - Revoke session
- `GET /api/v1/auth/profile` - Fetch current user profile
- `PUT /api/v1/auth/profile` - Update user bio & avatar

### Ticket APIs
- `GET /api/v1/tickets` - List tickets (Supports filtering by status, priority, category, agent, search)
- `GET /api/v1/tickets/:id` - Fetch ticket details with conversation & attachments
- `POST /api/v1/tickets` - Create new support ticket
- `PUT /api/v1/tickets/:id` - Update ticket details
- `PUT /api/v1/tickets/:id/assign` - Assign agent to ticket (Admin only)
- `PUT /api/v1/tickets/:id/status` - Transition ticket status & add resolution notes
- `POST /api/v1/tickets/:id/comments` - Post public comment or internal note
- `POST /api/v1/tickets/:id/attachments` - Upload file attachment

### Analytics APIs
- `GET /api/v1/analytics/overview` - Fetch KPI card statistics
- `GET /api/v1/analytics/status` - Get status percentage distribution
- `GET /api/v1/analytics/category` - Get ticket breakdown by category
- `GET /api/v1/analytics/monthly` - Get monthly trends data
- `GET /api/v1/analytics/employees` - Get agent performance leaderboard
- `GET /api/v1/analytics/export` - Download CSV analytical report

---

## 📝 Suggested Git Commit History

```bash
git commit -m "feat(db): design normalized MySQL schema and populate seed dataset"
git commit -m "feat(backend): set up Express server, JWT authentication, and RBAC middleware"
git commit -m "feat(backend): implement ticket lifecycle, comment threads, and attachment API endpoints"
git commit -m "feat(analytics): implement optimized SQL aggregation queries for SLA and performance KPIs"
git commit -m "feat(frontend): configure Vite, Tailwind CSS dark theme, and Axios interceptors"
git commit -m "feat(ui): build role-tailored dashboards, Recharts analytics, and ticket queue tables"
git commit -m "feat(docs): add Docker Compose orchestration, Postman collection, and README"
```

---

## 💼 ATS-Friendly Resume Bullet Points

- **Full-Stack Development & Architecture**: Designed and deployed a production-ready customer support analytics dashboard using **React 18 (Vite)**, **Node.js/Express**, and **MySQL 8.0**, implementing clean architecture and modular folder structures.
- **SQL Analytics & Reporting**: Wrote optimized SQL queries utilizing **Common Table Expressions (CTEs)**, `TIMESTAMPDIFF`, and conditional aggregations to calculate real-time SLA compliance rates, average resolution times, and agent performance leaderboards.
- **Secure Authentication & RBAC**: Implemented secure **JWT authentication** with access/refresh token rotation, bcrypt password hashing, and granular **Role-Based Access Control (RBAC)** middleware securing Admin, Agent, and Customer routes.
- **Data Visualization & Responsive UI**: Constructed dynamic analytical dashboards with **Recharts**, **Tailwind CSS (Dark/Light mode)**, and **React Hook Form**, featuring responsive charts, multi-filter search drawers, and notification centers.
- **RESTful API & DevOps**: Built REST APIs with **express-validator**, **helmet**, **express-rate-limit**, and **multer** attachment handling; containerized the entire stack using **Docker** and **Docker Compose**.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
#   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 #   S u p p o r t - I n s i g h t s - C u s t o m e r - S u p p o r t - A n a l y t i c s - D a s h b o a r d  
 