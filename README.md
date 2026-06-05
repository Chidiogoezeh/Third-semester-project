# Eventful Backend Capstone Project

An event management and ticketing platform built with a modular service-oriented architecture. Eventful enables organizers to create and manage events, process ticket sales, verify attendance through QR-based check-ins, and monitor business analytics through a scalable backend infrastructure.

---

## Technology Stack

### Core

- Node.js
- TypeScript
- Express.js

### Data Layer

- PostgreSQL
- Prisma

### Authentication & Security

- JWT Authentication
- Role-Based Access Control (RBAC)
- bcrypt Password Hashing

### Background Processing

- Redis
- BullMQ

### Payments

- Paystack Integration

---

## Core Capabilities

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Protected route access
- Role-based permissions

### Event Management

- Event creation and publishing
- Event discovery and listing
- Event updates and lifecycle management
- Organizer-owned event management

### Ticketing

- Ticket reservation and issuance
- Unique ticket token generation
- QR code generation
- Digital ticket validation

### Payment Processing

- Secure Paystack checkout
- Payment verification
- Webhook processing
- Automatic ticket issuance after successful payment

### Attendance Verification

- QR-based event check-in
- Duplicate scan prevention
- Real-time validation status

### Notifications & Reminders

- Scheduled event reminders
- Asynchronous job processing
- Queue-driven background tasks

### Analytics

- Event attendance metrics
- Ticket sales reporting
- Revenue analytics
- Check-in performance tracking

---

## System Architecture

The backend follows a layered architecture with clear separation of concerns.

```text
Client
  │
  ▼
Routes
  │
  ▼
Middleware
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
PostgreSQL Database
```

### Architectural Patterns

- Layered Architecture
- Repository Pattern
- Service-Oriented Modules
- Queue-Based Background Processing
- Event-Driven Payment Workflows

---

## Domain Modules

### Auth

Manages user authentication, authorization, and identity lifecycle.

### Users

Handles user profiles and account management.

### Events

Manages event creation, publishing, discovery, and organizer operations.

### Tickets

Handles ticket issuance, QR generation, and verification workflows.

### Payments

Processes payment initialization, verification, and reconciliation.

### Notifications

Schedules and dispatches reminders and transactional communications.

### Analytics

Aggregates attendance, sales, and revenue insights.

---

## Payment Lifecycle

```text
User Books Event
        │
        ▼
Initialize Paystack Transaction
        │
        ▼
User Completes Payment
        │
        ▼
Paystack Webhook
        │
        ▼
Verify Transaction
        │
        ▼
Issue Ticket
        │
        ▼
Generate QR Code
        │
        ▼
Schedule Reminders
        │
        ▼
Send Confirmation
```

---

## Security Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- Password Hashing
- Request Validation
- Rate Limiting
- Helmet Security Headers
- CORS Protection
- Webhook Signature Verification

---

## Infrastructure

### Database

- PostgreSQL
- Prisma

### Caching & Queues

- Redis
- BullMQ

### File & Asset Handling

- QR Code Generation
- Ticket Delivery Services

---

## Deployment

Designed for cloud-native deployment.

### Runtime

- Node.js 22+

---

## Project Goal

Eventful demonstrates the design and implementation of a scalable event-ticketing backend that combines secure authentication, payment processing, ticket lifecycle management, attendance verification, background job processing, and analytics within a production-inspired architecture.
