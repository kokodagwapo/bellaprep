# BellaPrep Backend API

Multi-Tenant SaaS Backend for Mortgage Application Platform

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: AWS Lambda + API Gateway
- **Authentication**: JWT with MFA support
- **Architecture**: Multi-tenant with row-level isolation

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- AWS CLI configured (for deployment)
- Redis (for Bull queue and caching)

### Installation

```bash
npm install
```

### Environment Configuration

1. Copy `env.example` to `.env.development`:
```bash
cp env.example .env.development
```

2. Update database URL and other secrets

### Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## Development

```bash
# Start in watch mode
npm run start:dev

# View API documentation
# Open http://localhost:3000/api/docs
```

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

### Development
```bash
npm run deploy:dev
```

### Staging
```bash
npm run deploy:staging
```

### Production
```bash
npm run deploy:prod
```

## API Documentation

Swagger documentation available at `/api/docs` when running in development mode.

## Multi-Tenant Architecture

- Each tenant is isolated via `tenantId` in database
- Tenant extracted from:
  - Subdomain (e.g., `acme.bellaprep.com`)
  - Custom domain (e.g., `bella.acmelending.com`)
  - JWT token claim
  - `X-Tenant-ID` header

## Modules

- **Auth**: Authentication & MFA
- **Tenants**: Tenant management
- **Users**: User management & RBAC
- **Products**: Loan product matrix
- **Forms**: Dynamic form builder
- **Loans**: Loan applications
- **Integrations**: Plaid, Calendar, etc.
- **QR**: QR code generation
- **Analytics**: Reporting
- **Audit**: Audit logging
- **Notifications**: Multi-channel notifications

## Security

- JWT with short expiry (15min)
- Refresh token rotation
- MFA support (SMS, Email, TOTP, WebAuthn, Face)
- Rate limiting
- CORS configured
- Helmet security headers
- Input validation
- SQL injection prevention (Prisma)

## License

Proprietary

