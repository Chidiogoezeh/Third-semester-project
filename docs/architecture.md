# Eventful Backend Architecture

## Architecture Style

- Layered Architecture
- Repository Pattern
- Service-Oriented Modules

---

# Request Flow

Client Request
↓
Route
↓
Middleware
↓
Controller
↓
Service
↓
Repository
↓
Database

---

# Modules

## Auth

Handles:

- Registration
- Login
- JWT authentication

## Events

Handles:

- Event creation
- Event listing
- Event details
- Creator events

## Tickets

Handles:

- Ticket booking
- QR generation
- Ticket verification

## Payments

Handles:

- Payment initialization
- Webhook verification
- Payment reconciliation

## Reminders

Handles:

- Reminder creation
- Delayed notifications

## Analytics

Handles:

- Revenue analytics
- Attendance analytics
- Scan metrics

## Users

Handles:

- User profile
- User updates

---

# Security

Implemented:

- JWT authentication
- RBAC authorization
- Helmet
- CORS
- Rate limiting
- Input validation
- Password hashing

---

# Database

PostgreSQL + Prisma ORM

---

# Queue System

BullMQ + Redis ready

---

# Deployment

- Render
- PostgreSQL
- Node.js 22
