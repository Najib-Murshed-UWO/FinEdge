# FinEdge API Documentation

## Overview
This document describes all REST API endpoints for the FinEdge Banking Platform.

All endpoints are prefixed with `/api` and require authentication (except `/api/auth/register` and `/api/auth/login`).

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### POST `/api/auth/register`
Register a new user.

### POST `/api/auth/login`
Login and create a session.

### POST `/api/auth/logout`
Logout and destroy session.

### GET `/api/auth/me`
Get current authenticated user.

---

## Bill Payments APIs

### Billers Management

#### GET `/api/billers`
Get all billers for the current customer.
**Response:** `{ "billers": [...] }`

#### GET `/api/billers/{id}`
Get a specific biller by ID.
**Response:** `{ "biller": {...} }`

#### POST `/api/billers`
Create a new biller.
**Request Body:**
```json
{
  "name": "Electric Company",
  "category": "UTILITIES",
  "accountNumber": "ELC-123456789",
  "phone": "1-800-555-0100",
  "email": "support@electric.com",
  "website": "www.electric.com"
}
```

#### PUT `/api/billers/{id}`
Update an existing biller.

#### DELETE `/api/billers/{id}`
Delete a biller.

---

### Bill Payments

#### GET `/api/bill-payments`
Get all bill payments for the current customer.
**Response:** `{ "payments": [...] }`

#### POST `/api/bill-payments`
Create a new bill payment.
**Request Body:**
```json
{
  "billerId": "biller-id",
  "accountId": "account-id",
  "amount": 125.50,
  "paymentDate": "2024-12-15T00:00:00",
  "type": "one-time",
  "description": "Monthly electric bill"
}
```

---

### Bill Reminders

#### GET `/api/bill-reminders`
Get all bill reminders for the current customer.
**Response:** `{ "reminders": [...] }`

#### POST `/api/bill-reminders`
Create a new bill reminder.
**Request Body:**
```json
{
  "billerId": "biller-id",
  "dueDate": "2024-12-15",
  "expectedAmount": 125.50,
  "daysBefore": 3
}
```

#### PATCH `/api/bill-reminders/{id}/toggle?enabled=true`
Enable or disable a reminder.

#### DELETE `/api/bill-reminders/{id}`
Delete a reminder.

---

### Auto-Pay

#### GET `/api/autopay`
Get all auto-pay configurations for the current customer.
**Response:** `{ "autoPays": [...] }`

#### POST `/api/autopay`
Create a new auto-pay configuration.
**Request Body:**
```json
{
  "billerId": "biller-id",
  "accountId": "account-id",
  "amount": 125.50,
  "frequency": "MONTHLY",
  "dayOfMonth": 15
}
```

#### PUT `/api/autopay/{id}`
Update an auto-pay configuration.

#### PATCH `/api/autopay/{id}/toggle?enabled=true`
Enable or disable auto-pay.

#### DELETE `/api/autopay/{id}`
Delete an auto-pay configuration.

---

## Cards Management APIs

### GET `/api/cards`
Get all cards for the current customer.
**Response:** `{ "cards": [...] }`

### GET `/api/cards/{id}`
Get a specific card by ID.
**Response:** `{ "card": {...} }`

### PATCH `/api/cards/{id}/freeze?freeze=true`
Freeze or unfreeze a card.
**Response:** `{ "card": {...} }`

### PUT `/api/cards/{id}/controls`
Update card controls (spending limits, online/international usage).
**Request Body:**
```json
{
  "spendingLimit": 5000.00,
  "onlineEnabled": true,
  "internationalEnabled": false
}
```

### POST `/api/cards/{id}/change-pin`
Change card PIN.
**Request Body:**
```json
{
  "currentPin": "1234",
  "newPin": "5678",
  "confirmPin": "5678"
}
```

### POST `/api/cards/{id}/report?reason=lost`
Report a card as lost or stolen.
**Query Parameters:**
- `reason`: "lost" or "stolen"

---

## Account Settings APIs

### Personal Details

#### PUT `/api/settings/personal-details`
Update personal details.
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "gender": "male",
  "occupation": "Software Engineer",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "United States"
}
```

---

### Contact Information

#### PUT `/api/settings/contact-info`
Update contact information.
**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "phone": "+1 (555) 123-4567",
  "alternatePhone": "+1 (555) 987-6543",
  "mailingAddress": "123 Main Street",
  "mailingCity": "New York",
  "mailingState": "NY",
  "mailingZipCode": "10001",
  "mailingCountry": "United States"
}
```

---

### User Settings

#### GET `/api/settings`
Get user settings (language, preferences, etc.).
**Response:** `{ "settings": {...} }`

#### PUT `/api/settings`
Update user settings.
**Request Body:**
```json
{
  "language": "en-US",
  "dateFormat": "MM/DD/YYYY",
  "timeFormat": "12h",
  "currency": "USD",
  "timezone": "America/New_York",
  "notificationPreferences": {
    "emailNotifications": true,
    "smsNotifications": true,
    "pushNotifications": true,
    "transactionAlerts": true,
    "paymentReminders": true,
    "securityAlerts": true,
    "accountUpdates": true,
    "marketingEmails": false,
    "promotionalOffers": false
  },
  "privacySettings": {
    "dataSharing": true,
    "analyticsTracking": true,
    "personalizedAds": false,
    "thirdPartySharing": false,
    "biometricAuth": true,
    "locationTracking": false
  }
}
```

---

## Existing APIs

### Accounts
- `GET /api/accounts` - Get my accounts
- `GET /api/accounts/{id}` - Get account by ID
- `POST /api/accounts` - Create account
- `PATCH /api/accounts/{id}` - Update account

### Transactions
- `GET /api/transactions` - Get my transactions
- `GET /api/accounts/{accountId}/transactions` - Get account transactions
- `POST /api/transactions` - Create transaction

### Loans
- `GET /api/loans` - Get my loans
- `GET /api/loans/{id}` - Get loan by ID
- `GET /api/loan-applications` - Get my loan applications
- `POST /api/loan-applications` - Submit loan application

### Notifications
- `GET /api/notifications` - Get my notifications
- `GET /api/notifications/unread` - Get unread notifications

### Analytics
- `GET /api/analytics/customer` - Get customer analytics

---

## Error Responses

All endpoints return errors in the following format:
```json
{
  "message": "Error message",
  "status": 400
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication

Most endpoints require authentication via session cookies. Include credentials in requests:
- Cookies are automatically sent with requests
- Session is created on login
- Session is destroyed on logout

