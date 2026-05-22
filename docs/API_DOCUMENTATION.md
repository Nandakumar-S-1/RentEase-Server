# RentEase API Documentation

## Overview

RentEase is a property rental platform that enables property owners and tenants to manage rentals, write agreements, payments,service maintenance requests, and disputes efficiently.

This document provides detailed information about all major API endpoints in the RentEase backend system.

---

# Base URL

```env
http://localhost:5000/api
```

---

# Authentication

Most protected endpoints require JWT authentication.

## Authorization Header

```http
Authorization: Bearer <access_token>
```

---

# Response Structure

## Success Response

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

---

# Status Codes

| Status Code | Description |
|---|---|
| 200 | OK |
| 201 | Resource Created |
| 300 | Found |
| 400 | Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# Auth APIs

## Signup

### Endpoint

```http
POST /auth/register
```

### Request Body

```json
{
  "full_name": "Nanda Kumar",
  "email": "nanda@example.com",
  "phone": "+919876543210",
  "password": "SecurePass@123",
  "confirm_password": "SecurePass@123"
}
```

### Success Response — 201

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user_id": "uuid",
    "email": "nanda@example.com",
    "user_type": "owner",
    "email_verification_token_sent": true
  }
}
```

### Validation Error — 400

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data"
  }
}
```

---

# Admin APIs

---

# User Management

## Get All Users

### Endpoint

```http
GET /admin/users
```

### Success Response

```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 8542,
      "active": 8120,
      "suspended": 98
    },
    "users": []
  }
}
```

---

## Get User Details

### Endpoint

```http
GET /admin/users/:user_id
```

---

## Verify User

### Endpoint

```http
PATCH /admin/users/:user_id/verify
```

### Request Body

```json
{
  "verification_type": "email"
}
```

---

## Suspend User

### Endpoint

```http
PATCH /admin/users/:user_id/suspend
```

### Request Body

```json
{
  "suspension_reason": "Fraudulent activity reported",
  "suspension_duration_days": null
}
```

---

## Unsuspend User

### Endpoint

```http
PATCH /admin/users/:user_id/unsuspend
```

---

## Delete User

### Endpoint

```http
DELETE /admin/users/:user_id
```

### Request Body

```json
{
  "confirm_deletion": true,
  "deletion_reason": "User requested account deletion"
}
```

---

# Property Management APIs

## Get All Properties

### Endpoint

```http
GET /admin/properties
```

---

## Get Property Details

### Endpoint

```http
GET /admin/properties/:property_id
```

---

## Approve Property

### Endpoint

```http
PATCH /admin/properties/:property_id/approve
```

### Request Body

```json
{
  "is_featured": false
}
```

### Success Response

```json
{
  "success": true,
  "message": "Property approved and published"
}
```

---

## Reject Property

### Endpoint

```http
PATCH /admin/properties/:property_id/reject
```

---

## Delete Property

### Endpoint

```http
DELETE /admin/properties/:property_id
```

### Request Body

```json
{
  "deletion_reason": "Fake listing - property doesn't exist"
}
```

---

# Agreement APIs

## Get All Agreements

### Endpoint

```http
GET /admin/agreements
```

---

## Get Agreement Details

### Endpoint

```http
GET /admin/agreements/:agreement_id
```

---

## Terminate Agreement

### Endpoint

```http
PATCH /admin/agreements/:agreement_id/terminate
```

### Request Body

```json
{
  "termination_reason": "Platform policy violation"
}
```

---

# Payment APIs

## Get All Payments

### Endpoint

```http
GET /admin/payments
```

---

## Get Payment Details

### Endpoint

```http
GET /admin/payments/:payment_id
```

---

## Refund Payment

### Endpoint

```http
POST /admin/payments/:payment_id/refund
```

### Request Body

```json
{
  "refund_amount": 12000,
  "refund_reason": "Duplicate payment"
}
```

---

# Maintenance APIs

## Get Maintenance Requests

### Endpoint

```http
GET /admin/maintenance-requests
```

---

# Reports APIs

## Get All Reports

### Endpoint

```http
GET /admin/reports
```

---

## Get Report Details

### Endpoint

```http
GET /admin/reports/:report_id
```

---

## Take Action on Report

### Endpoint

```http
POST /admin/reports/:report_id/take-action
```

### Request Body

```json
{
  "action_taken": "content_removed",
  "action_reason": "Property verified as fake listing",
  "notify_reporter": true
}
```

---

# Dispute APIs

## Get All Disputes

### Endpoint

```http
GET /admin/disputes
```

---

## Get Dispute Details

### Endpoint

```http
GET /admin/disputes/:dispute_id
```

---

## Resolve Dispute

### Endpoint

```http
POST /admin/disputes/:dispute_id/resolve
```

### Request Body

```json
{
  "resolution_decision": "Based on evidence review",
  "amount_to_claimant": 18000,
  "amount_to_respondent": 6000,
  "resolution_deadline": "2025-02-15"
}
```

---

# Financial Reports APIs

## Get Financial Reports

### Endpoint

```http
GET /admin/reports/financial
```

---

# Dashboard APIs

## Get Dashboard Statistics

### Endpoint

```http
GET /admin/dashboard
```

---

# Settings APIs

## Get Settings

### Endpoint

```http
GET /admin/settings
```

---

## Update Settings

### Endpoint

```http
PUT /admin/settings/:setting_key
```

### Request Body

```json
{
  "setting_value": {
    "owner_commission": 3.0,
    "tenant_commission": 0
  }
}
```

---

# Admin Management APIs

## Create New Admin

### Endpoint

```http
POST /admin/admins/create
```

### Request Body

```json
{
  "full_name": "New Admin",
  "email": "newadmin@rentease.com",
  "phone": "+919999999999",
  "admin_role": "admin",
  "permissions": [
    "user_management",
    "property_approval",
    "payments"
  ]
}
```

### Success Response — 201

```json
{
  "success": true,
  "message": "Admin user created. Credentials sent via email."
}
```

---

# Environment Variables

DATABASE_URL : postgresql:// name : postgress password @localhost:5432/rentease"
PORT
CLIENT_SIDE_URL

REDIS_USERNAME
REDIS_PASSWORD
REDIS_HOST
REDIS_PORT

JWT_ACCESS_TOKEN_SECRET
JWT_REFRESH_TOKEN_SECRET
JWT_ACCESS_TOKEN_EXPIRY
JWT_REFRESH_TOKEN_EXPIRY


NODEMAILER_EMAIL
NODEMAILER_PASS

FIREBASE_SERVICE_ACCOUNT_PATH


CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET


AWS_REGION
AWS_ACCESS_KEY
AWS_SECRET_KEY
AWS_BUCKET_NAME
S3_EXPIRY_TIME

OLA_MAP_TOKEN_API
OLA_MAP_CLIENT_ID
OLA_MAP_CLIENT_SECRET
```

---

# Pagination

Most list endpoints support pagination.

## Example

```http
GET /admin/users?page=1&limit=10
```

## Pagination Response

```json
{
  "pagination": {
    "total": 8542,
    "page": 1,
    "limit": 10,
    "total_pages": 855
  }
}
```

---

# Security Recommendations

- Use HTTPS in production
- Store JWT secrets securely
- Enable rate limiting
- Validate all incoming requests
- Sanitize user-generated content
- Use secure cookie settings
- Rotate refresh tokens periodically

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Redis
- JWT Authentication
- Prisma
- Cloudinary
- S3
- Ola maps
- Google Vision API
- MongoDB
- Redux
- Stripe
- Firebase

---

# Contributors

Developed by Nandakumar S
