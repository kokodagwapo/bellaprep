#!/bin/bash

# BellaPrep Deployment Script
# Deploys the backend to AWS Lambda

set -e

STAGE=${1:-staging}

echo "🚀 Deploying BellaPrep Backend to AWS Lambda"
echo "Stage: $STAGE"
echo ""

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "Installing Serverless Framework..."
    npm install -g serverless@3
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma Client
echo "🔨 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Deploy to AWS Lambda
echo "☁️  Deploying to AWS Lambda ($STAGE)..."
serverless deploy --stage $STAGE --verbose

echo ""
echo "✅ Deployment complete!"
echo ""
echo "API Gateway URL:"
serverless info --stage $STAGE | grep "endpoint:"
echo ""

