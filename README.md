# Eventful Backend

A scalable event management and ticketing platform built with **Node.js**, **TypeScript**, and **Express.js**. Eventful enables creators to manage events, sell tickets, verify attendance through QR codes, send reminders, process payments, and monitor event performance through analytics.

---

## Tech Stack

| Layer           | Technology        |
| --------------- | ----------------- |
| Runtime         | Node.js           |
| Language        | TypeScript        |
| Framework       | Express.js        |
| Database        | PostgreSQL        |
| ORM             | Prisma            |
| Cache           | Redis             |
| Authentication  | JWT, bcrypt       |
| Payments        | Paystack          |
| Background Jobs | BullMQ            |
| Testing         | Jest, Supertest   |
| Documentation   | Swagger / Postman |

---

## Features

### Authentication & Authorization

- User registration and login
- JWT authentication
- Role-Based Access Control (RBAC)

**Roles**

- **Creator** – Creates and manages events
- **Eventee** – Discovers events and purchases tickets

### Event Management

Creators can:

- Create, update, and delete events
- View attendees
- Access analytics and payment records

Eventees can:

- Browse and search events
- View event details
- Purchase tickets

### Ticketing & Verification

- Ticket purchase workflow
- QR code generation
- Digital ticket issuance
- QR-based attendance verification
- Duplicate scan prevention

### Payments

- Paystack integration
- Payment initialization and verification
- Webhook handling
- Automatic ticket generation after successful payment

### Reminders & Notifications

- Creator-configured reminders
- User reminder preferences
- Scheduled event notifications
- Queue-based background processing

### Event Sharing

- Public event pages (`/events/:slug`)
- Social sharing support for:
  - WhatsApp
  - Facebook
  - X (Twitter)
  - LinkedIn

### Analytics

Creators can view:

- Total events created
- Tickets sold
- Total attendees
- Event-specific attendance metrics
- Scanned ticket statistics

---

## Architecture

```text
Client
   │
   ▼
Express API
   │
   ├── PostgreSQL (Prisma)
   ├── Redis Cache
   ├── BullMQ Workers
   └── Paystack
```

### Design Principles

- Layered Architecture
- Separation of Concerns
- Service-Oriented Modules
- Queue-Based Processing
- Maintainable TypeScript Codebase

---

## Core Modules

```text
Auth
Users
Events
Tickets
Payments
Reminders
Analytics
Notifications
```

---

## Payment Flow

```text
Book Ticket
    │
    ▼
Initialize Paystack Payment
    │
    ▼
Payment Success
    │
    ▼
Verify Transaction
    │
    ▼
Generate Ticket
    │
    ▼
Generate QR Code
    │
    ▼
Schedule Reminders
```

---

## Security

- JWT Authentication
- bcrypt Password Hashing
- Input Validation
- Protected Routes
- Basic Rate Limiting
- CORS Protection
- Webhook Signature Verification

---

## API Overview

### Authentication

```http
POST /auth/register
POST /auth/login
```

### Events

```http
GET    /events
GET    /events/:id
POST   /events
PATCH  /events/:id
DELETE /events/:id
```

### Tickets

```http
POST /events/:id/book
POST /tickets/verify
```

### Reminders

```http
POST /events/:id/reminders
```

### Analytics

```http
GET /analytics
```

---

## Testing

### Unit Tests

- Services
- Utility Functions

### Integration Tests

- Authentication Flow
- Event Management Flow
- Ticket Booking Flow
- Payment Flow

Tools:

- Jest
- Supertest

---

## Project Objective

Eventful demonstrates a production-inspired backend architecture that combines:

- Authentication & Authorization
- Event Management
- Ticket Purchasing
- QR Code Generation & Verification
- Paystack Payments
- Reminder Notifications
- Event Analytics
- Redis Caching
- Rate Limiting
- API Testing & Documentation

Built as a capstone project to showcase scalable backend engineering practices using the Node.js ecosystem.
