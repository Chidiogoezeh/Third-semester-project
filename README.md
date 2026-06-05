# Eventful Backend

Production-inspired backend for event management and ticketing.

## Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma
- JWT
- Redis
- BullMQ

## Features

- Authentication
- Event Management
- Ticket Booking
- QR Verification
- Analytics
- Reminders
- Paystack Payments

## Setup

```bash
npm install
```

# Eventful API Flow

## Registration

POST /api/v1/auth/register

1. Validate payload
2. Hash password
3. Create user
4. Generate JWT
5. Return response

---

## Login

POST /api/v1/auth/login

1. Validate credentials
2. Compare password
3. Generate JWT
4. Return token

---

## Create Event

POST /api/v1/events

1. Authenticate creator
2. Validate payload
3. Generate slug
4. Persist event
5. Return event

---

## Book Ticket

POST /api/v1/tickets/book/:id

1. Authenticate eventee
2. Create ticket
3. Generate token
4. Return ticket

---

## Verify Ticket

POST /api/v1/tickets/verify

1. Authenticate creator
2. Validate token
3. Check scanned status
4. Mark ticket scanned
5. Return verification result

---

## Book Event

POST /api/v1/events/:id/book

1. Authenticate eventee
2. Validate event
3. Check capacity
4. Create pending payment
5. Initialize Paystack checkout
6. Return authorization URL

---

## Payment Webhook

POST /api/v1/payments/webhook

1. Receive Paystack event
2. Verify webhook signature
3. Confirm charge.success
4. Validate amount
5. Mark payment SUCCESS
6. Create ticket
7. Generate QR code
8. Schedule reminders
9. Send ticket email
10. Return success

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
