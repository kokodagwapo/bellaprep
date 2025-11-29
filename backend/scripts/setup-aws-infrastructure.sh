#!/bin/bash

# BellaPrep AWS Infrastructure Setup Script
# This script sets up all required AWS resources for the BellaPrep backend

set -e

echo "🚀 BellaPrep AWS Infrastructure Setup"
echo "======================================"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
echo "✅ Checking AWS credentials..."
aws sts get-caller-identity > /dev/null 2>&1 || {
    echo "❌ AWS credentials not configured. Run 'aws configure' first."
    exit 1
}

# Set variables
AWS_REGION=${AWS_REGION:-us-east-1}
PROJECT_NAME="bellaprep"
STAGE=${STAGE:-production}
DB_NAME="${PROJECT_NAME}_${STAGE}"
DB_USERNAME="bellaprep_admin"
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

echo ""
echo "Configuration:"
echo "  Region: $AWS_REGION"
echo "  Stage: $STAGE"
echo "  Database: $DB_NAME"
echo ""

# 1. Create VPC (if not exists)
echo "📦 Step 1: Setting up VPC..."
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=${PROJECT_NAME}-vpc" --query 'Vpcs[0].VpcId' --output text)

if [ "$VPC_ID" = "None" ] || [ -z "$VPC_ID" ]; then
    echo "Creating new VPC..."
    VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
    aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=${PROJECT_NAME}-vpc
    echo "✅ VPC created: $VPC_ID"
else
    echo "✅ Using existing VPC: $VPC_ID"
fi

# 2. Create Subnets
echo ""
echo "🌐 Step 2: Setting up Subnets..."
SUBNET1_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone ${AWS_REGION}a --query 'Subnet.SubnetId' --output text 2>/dev/null || echo "")
SUBNET2_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone ${AWS_REGION}b --query 'Subnet.SubnetId' --output text 2>/dev/null || echo "")

if [ -n "$SUBNET1_ID" ]; then
    aws ec2 create-tags --resources $SUBNET1_ID --tags Key=Name,Value=${PROJECT_NAME}-subnet-1
    echo "✅ Subnet 1 created: $SUBNET1_ID"
fi

if [ -n "$SUBNET2_ID" ]; then
    aws ec2 create-tags --resources $SUBNET2_ID --tags Key=Name,Value=${PROJECT_NAME}-subnet-2
    echo "✅ Subnet 2 created: $SUBNET2_ID"
fi

# 3. Create Security Group
echo ""
echo "🔒 Step 3: Setting up Security Group..."
SG_ID=$(aws ec2 create-security-group \
    --group-name ${PROJECT_NAME}-sg \
    --description "Security group for BellaPrep" \
    --vpc-id $VPC_ID \
    --query 'GroupId' \
    --output text 2>/dev/null || echo "")

if [ -n "$SG_ID" ]; then
    # Allow PostgreSQL from within VPC
    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 5432 \
        --cidr 10.0.0.0/16
    
    # Allow Redis from within VPC
    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 6379 \
        --cidr 10.0.0.0/16
    
    echo "✅ Security Group created: $SG_ID"
else
    echo "⚠️  Security Group may already exist"
fi

# 4. Create RDS PostgreSQL Database
echo ""
echo "🗄️  Step 4: Creating RDS PostgreSQL Database..."
echo "This may take 5-10 minutes..."

DB_INSTANCE_ID="${PROJECT_NAME}-db-${STAGE}"

aws rds create-db-instance \
    --db-instance-identifier $DB_INSTANCE_ID \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.3 \
    --master-username $DB_USERNAME \
    --master-user-password $DB_PASSWORD \
    --allocated-storage 20 \
    --vpc-security-group-ids $SG_ID \
    --db-name $DB_NAME \
    --backup-retention-period 7 \
    --no-publicly-accessible \
    --storage-encrypted \
    --tags Key=Name,Value=$DB_INSTANCE_ID Key=Environment,Value=$STAGE \
    2>/dev/null || echo "⚠️  Database may already exist"

echo "⏳ Waiting for database to be available..."
aws rds wait db-instance-available --db-instance-identifier $DB_INSTANCE_ID

# Get database endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_ENDPOINT}:5432/${DB_NAME}"
echo "✅ Database created: $DB_ENDPOINT"

# 5. Create ElastiCache Redis
echo ""
echo "📮 Step 5: Creating ElastiCache Redis..."

REDIS_CLUSTER_ID="${PROJECT_NAME}-redis-${STAGE}"

aws elasticache create-cache-cluster \
    --cache-cluster-id $REDIS_CLUSTER_ID \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --num-cache-nodes 1 \
    --security-group-ids $SG_ID \
    --tags Key=Name,Value=$REDIS_CLUSTER_ID Key=Environment,Value=$STAGE \
    2>/dev/null || echo "⚠️  Redis cluster may already exist"

echo "⏳ Waiting for Redis to be available..."
sleep 30

# Get Redis endpoint
REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters \
    --cache-cluster-id $REDIS_CLUSTER_ID \
    --show-cache-node-info \
    --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
    --output text 2>/dev/null || echo "pending")

if [ "$REDIS_ENDPOINT" != "pending" ]; then
    echo "✅ Redis created: $REDIS_ENDPOINT"
else
    echo "⏳ Redis is still being created. Check AWS Console for status."
fi

# 6. Create S3 Bucket for file uploads
echo ""
echo "🪣 Step 6: Creating S3 Bucket..."

S3_BUCKET="${PROJECT_NAME}-uploads-${STAGE}-$(date +%s)"

aws s3 mb s3://$S3_BUCKET --region $AWS_REGION 2>/dev/null || echo "⚠️  Bucket may already exist"

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket $S3_BUCKET \
    --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
    --bucket $S3_BUCKET \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
            }
        }]
    }'

# Set CORS policy
aws s3api put-bucket-cors \
    --bucket $S3_BUCKET \
    --cors-configuration file://<(cat <<EOF
{
    "CORSRules": [{
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"]
    }]
}
EOF
)

echo "✅ S3 Bucket created: $S3_BUCKET"

# 7. Create IAM Role for Lambda
echo ""
echo "👤 Step 7: Creating IAM Role for Lambda..."

LAMBDA_ROLE_NAME="${PROJECT_NAME}-lambda-role"

# Create trust policy
cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Service": "lambda.amazonaws.com"
    },
    "Action": "sts:AssumeRole"
  }]
}
EOF

aws iam create-role \
    --role-name $LAMBDA_ROLE_NAME \
    --assume-role-policy-document file:///tmp/trust-policy.json \
    2>/dev/null || echo "⚠️  IAM Role may already exist"

# Attach policies
aws iam attach-role-policy \
    --role-name $LAMBDA_ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole

aws iam attach-role-policy \
    --role-name $LAMBDA_ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

echo "✅ IAM Role created: $LAMBDA_ROLE_NAME"

# 8. Store secrets in AWS Systems Manager Parameter Store
echo ""
echo "🔐 Step 8: Storing secrets in Parameter Store..."

aws ssm put-parameter \
    --name "/${PROJECT_NAME}/${STAGE}/database-url" \
    --value "$DATABASE_URL" \
    --type "SecureString" \
    --overwrite 2>/dev/null || true

aws ssm put-parameter \
    --name "/${PROJECT_NAME}/${STAGE}/jwt-secret" \
    --value "$(openssl rand -base64 32)" \
    --type "SecureString" \
    --overwrite 2>/dev/null || true

aws ssm put-parameter \
    --name "/${PROJECT_NAME}/${STAGE}/jwt-refresh-secret" \
    --value "$(openssl rand -base64 32)" \
    --type "SecureString" \
    --overwrite 2>/dev/null || true

aws ssm put-parameter \
    --name "/${PROJECT_NAME}/${STAGE}/encryption-key" \
    --value "$(openssl rand -base64 32)" \
    --type "SecureString" \
    --overwrite 2>/dev/null || true

aws ssm put-parameter \
    --name "/${PROJECT_NAME}/${STAGE}/redis-host" \
    --value "$REDIS_ENDPOINT" \
    --type "String" \
    --overwrite 2>/dev/null || true

aws ssm put-parameter \
    --name "/${PROJECT_NAME}/${STAGE}/s3-bucket" \
    --value "$S3_BUCKET" \
    --type "String" \
    --overwrite 2>/dev/null || true

echo "✅ Secrets stored in Parameter Store"

# 9. Output summary
echo ""
echo "🎉 ======================================"
echo "🎉 Infrastructure Setup Complete!"
echo "🎉 ======================================"
echo ""
echo "📋 Summary:"
echo "  VPC ID: $VPC_ID"
echo "  Security Group: $SG_ID"
echo "  Database Endpoint: $DB_ENDPOINT"
echo "  Redis Endpoint: $REDIS_ENDPOINT"
echo "  S3 Bucket: $S3_BUCKET"
echo "  Lambda Role: $LAMBDA_ROLE_NAME"
echo ""
echo "🔐 Credentials (SAVE THESE SECURELY!):"
echo "  Database Username: $DB_USERNAME"
echo "  Database Password: $DB_PASSWORD"
echo ""
echo "📝 Next Steps:"
echo "  1. Update backend/.env with these values"
echo "  2. Run 'npm run prisma:migrate' to create database schema"
echo "  3. Run 'serverless deploy' to deploy the backend"
echo ""
echo "💡 All secrets are stored in AWS Systems Manager Parameter Store"
echo "   Path: /${PROJECT_NAME}/${STAGE}/*"
echo ""

