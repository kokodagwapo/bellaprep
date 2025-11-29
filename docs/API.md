# BellaPrep API Documentation

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://api.bellaprep.com/api`

## Authentication

All endpoints (except public auth endpoints) require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/mfa/verify` - Verify MFA code
- `POST /auth/mfa/setup` - Setup MFA
- `GET /auth/me` - Get current user

### Tenants
- `GET /tenants` - Get tenants (filtered by role)
- `GET /tenants/:id` - Get tenant by ID
- `POST /tenants` - Create tenant (Super Admin only)
- `PATCH /tenants/:id` - Update tenant
- `DELETE /tenants/:id` - Delete tenant (Super Admin only)

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user (Admin only)
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)
- `POST /users/invite` - Invite user (Admin only)

### Products
- `GET /products` - Get all products for tenant
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Admin only)
- `PATCH /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)
- `GET /products/eligible` - Get eligible products
- `POST /products/:id/check-eligibility` - Check eligibility

### Forms
- `GET /forms` - Get all form templates
- `GET /forms/:id` - Get form template by ID
- `POST /forms` - Create form template (Admin only)
- `PATCH /forms/:id` - Update form template (Admin only)
- `DELETE /forms/:id` - Delete form template (Admin only)
- `POST /forms/:id/evaluate` - Evaluate form template
- `POST /forms/:id/validate` - Validate form data

### Borrowers
- `GET /borrowers` - Get all borrowers
- `GET /borrowers/:id` - Get borrower by ID
- `POST /borrowers` - Create borrower
- `PATCH /borrowers/:id` - Update borrower
- `POST /borrowers/:id/submit` - Submit borrower form
- `PATCH /borrowers/:id/status` - Update loan status
- `DELETE /borrowers/:id` - Delete borrower

### QR Codes
- `GET /qr` - Get all QR codes
- `GET /qr/:id` - Get QR code by ID
- `POST /qr` - Create QR code
- `POST /qr/validate` - Validate QR token
- `POST /qr/scan` - Scan QR code
- `DELETE /qr/:id` - Delete QR code

### Analytics
- `GET /analytics/pipeline` - Get pipeline metrics
- `GET /analytics/funnel` - Get funnel analytics
- `GET /analytics/lo-performance` - Get LO performance
- `GET /analytics/documents` - Get document stats
- `GET /analytics/bella-usage` - Get Bella usage stats
- `GET /analytics/super-admin` - Get super admin stats

### Bella
- `POST /bella/chat` - Chat with Bella
- `POST /bella/voice/session` - Create voice session
- `POST /bella/voice/process` - Process voice input
- `POST /bella/voice/generate` - Generate voice response

### Plaid
- `POST /plaid/link-token` - Create Plaid Link token
- `POST /plaid/exchange-token` - Exchange public token
- `POST /plaid/sync` - Sync Plaid accounts
- `POST /plaid/income-verification` - Get income verification

### Calendar
- `GET /calendar/auth-url` - Get OAuth URL
- `POST /calendar/callback` - Handle OAuth callback
- `POST /calendar/appointment` - Create appointment
- `GET /calendar/appointments` - Get upcoming appointments

### Audit
- `GET /audit` - Get audit logs
- `GET /audit/stats` - Get audit statistics
- `GET /audit/:id` - Get audit log by ID
- `GET /audit/stream` - Stream audit logs (SSE)

## Swagger Documentation

When running locally, Swagger docs are available at:
`http://localhost:3000/api/docs`

