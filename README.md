# 📊 Lead Management CRM

A full-stack **Lead Management CRM system** built for small businesses to manage customers, track leads, and improve sales workflow.  
The system includes **authentication, lead tracking, and status management** with a clean dashboard UI.

---

## 🚀 Features

### 🔐 Authentication System
- User registration & login
- Secure JWT-based authentication
- HTTP-only cookie session handling
- Protected routes (dashboard access only after login)
- Logout with token invalidation

---

### 👥 Lead Management System
- Create new leads/customers
- View all leads in dashboard
- Update lead details
- Delete leads
- Change lead status:
  -  New
  -  Contacted
  -  Qualified
  - Converted
  - Lost

---

### 🔎 Search & Filter
- Search leads by:
  - Name
  - Email
  - Company
- Fast filtering for better usability

---

### 📊 Dashboard
- Clean and responsive UI
- Lead statistics overview
- Status-based organization
- Quick actions (edit, delete, update status)

---

## 🛠 Tech Stack

### Frontend
- Next.js / React.js
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Cookie-based session handling

---

## APIs Auth
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- GET /api/v1/auth/me
- POST /api/v1/auth/refresh-token

## APIs leads

- GET /api/v1/leads/get
- POST /api/v1/leads/create
- DELETE /api/v1/leads/:id
- PUT /api/v1/leads/:id
- GET /api/v1/leads/search?q=google
- GET /api/v1/leads/stats


---

## 🔒 Security 
- Password hashing (bcrypt)
- HTTP-only cookies
- JWT expiration handling
- Protected API routes
- Refresh token strategy 

---

# Code for all:

- backend: https://github.com/SarvanMaurya123/InstaWebTask
- Frontend: https://github.com/SarvanMaurya123/InstaWebTaskFrontend
- LIVE DEOM: https://insta-web-task-frontend.vercel.app/


# THANK YOU
..................................................................................Thanks.....................................