# BellaPrep Developer Setup Guide

## Prerequisites

- Node.js 20.x
- PostgreSQL 14+
- npm or yarn

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up database:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed  # Optional
```

5. Start development server:
```bash
npm run start:dev
```

Backend will run on `http://localhost:3000`
Swagger docs available at `http://localhost:3000/api/docs`

## Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create `.env` file:
```
VITE_API_URL=http://localhost:3000/api
VITE_MAPBOX_API_KEY=your_mapbox_key
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5175`

## Project Structure

```
bellaprep/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── common/      # Shared utilities
│   │   └── main.ts      # Entry point
│   └── prisma/          # Database schema
├── src/                 # React frontend
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication
│   │   ├── prep4loan/   # Prep4Loan flow
│   │   ├── urla1003/    # URLA 1003 form
│   │   ├── settings/    # Admin settings
│   │   └── ...
│   └── lib/             # Utilities
└── components/          # Legacy components (being migrated)
```

## Running Tests

Backend:
```bash
cd backend
npm run test
```

Frontend:
```bash
npm run test
```

## Database Management

Generate Prisma Client:
```bash
cd backend
npm run prisma:generate
```

Create migration:
```bash
npm run prisma:migrate
```

Open Prisma Studio:
```bash
npm run prisma:studio
```

## Code Style

Backend uses ESLint and Prettier:
```bash
cd backend
npm run lint
npm run format
```

