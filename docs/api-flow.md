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

## Payment Webhook

POST /api/v1/payments/webhook

1. Verify signature
2. Validate event
3. Update payment status
4. Return success
