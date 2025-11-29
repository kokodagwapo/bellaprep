# BellaPrep Deployment Guide

## Prerequisites

- AWS Account
- AWS CLI configured
- Serverless Framework installed (`npm install -g serverless`)
- Node.js 20.x
- PostgreSQL database (AWS RDS)

## Environment Setup

1. Copy `.env.example` to `.env` and fill in all values:
```bash
cp backend/.env.example backend/.env
```

2. Set up AWS RDS PostgreSQL database
3. Configure VPC and security groups for Lambda access
4. Set up all required API keys (Plaid, Google, SendGrid, Twilio, OpenAI)

## Database Setup

1. Run Prisma migrations:
```bash
cd backend
npm run prisma:migrate
```

2. Seed database (optional):
```bash
npm run prisma:seed
```

## Backend Deployment

1. Build the backend:
```bash
cd backend
npm install
npm run build
```

2. Deploy to AWS Lambda:
```bash
npm run deploy:dev  # or deploy:prod
```

## Frontend Deployment

The frontend is deployed to GitHub Pages automatically via GitHub Actions.

To deploy manually:
```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

## Environment Variables

Set the following in AWS Lambda environment variables or `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PLAID_CLIENT_ID` - Plaid client ID
- `PLAID_SECRET` - Plaid secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `SENDGRID_API_KEY` - SendGrid API key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `OPENAI_API_KEY` - OpenAI API key
- `FRONTEND_URL` - Frontend URL for CORS

## Monitoring

- CloudWatch Logs: Check Lambda function logs
- CloudWatch Metrics: Monitor function performance
- API Gateway: Monitor API usage and errors

