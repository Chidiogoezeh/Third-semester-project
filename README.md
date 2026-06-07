# Eventful Backend

Eventful is an event management and ticketing API built with Node.js, TypeScript, Express, PostgreSQL, and Prisma. The platform enables event creators to publish events, manage attendees, sell tickets, verify attendance through QR codes, automate reminders, process payments via Paystack, and track event performance through analytics.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ
- JWT Authentication
- Paystack
- Nodemailer
- Jest and Supertest
- Swagger

## Features

### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Role-based access control (RBAC)

**Roles**

- Creator
- Eventee

### Event Management

Creators can:

- Create, update, and delete events
- Manage attendees
- Configure reminder schedules
- View analytics and revenue metrics

Eventees can:

- Browse public events
- Search events
- View event details
- Purchase tickets

### Ticketing

- QR-code ticket generation
- Secure ticket tokens
- Attendance verification
- Duplicate scan prevention
- User ticket history

### Payments

- Paystack payment integration
- Checkout session initialization
- Webhook verification
- Automatic ticket issuance after payment success

### Notifications

- Email ticket delivery
- Payment confirmations
- Scheduled event reminders
- Queue-based background processing with BullMQ

### Analytics

Creator dashboard includes:

- Total events
- Revenue
- Tickets sold
- Attendance metrics
- Scan rates
- Event-level performance breakdowns

## Architecture

Client
│
▼
Express API
│
├── PostgreSQL (Prisma)
├── Redis Cache
├── BullMQ Workers
├── Paystack
└── Email Service

## API Modules

Auth
Users
Events
Tickets
Payments
Reminders
Analytics
Notifications

## Security

- JWT Authentication
- bcrypt Password Hashing
- Zod Validation
- Rate Limiting
- CORS Protection
- Helmet Security Headers
- Paystack Webhook Signature Verification

## Main Endpoints

http
POST /api/v1/auth/register
POST /api/v1/auth/login

GET /api/v1/events
GET /api/v1/events/:slug
POST /api/v1/events
PATCH /api/v1/events/:id
DELETE /api/v1/events/:id

POST /api/v1/events/:id/book

GET /api/v1/tickets/me
POST /api/v1/tickets/verify

POST /api/v1/events/:id/reminders

GET /api/v1/payments/creator
POST /api/v1/payments/webhook

GET /api/v1/analytics/dashboard

GET /api/v1/users/me
PATCH /api/v1/users/me

## Development

bash

# Install dependencies

npm install

# Generate Prisma client

npm run prisma:generate

# Run migrations

npm run prisma:migrate

# Start development server

npm run dev

# Run tests

npm test

# Build production

npm run build

## Environment Variables

env
DATABASE_URL=
JWT_SECRET=
PAYSTACK_SECRET_KEY=
REDIS_URL=
CLIENT_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

## Testing

- Unit Tests (Services & Utilities)
- Integration Tests (API Endpoints)
- Jest
- Supertest

## License

MIT
