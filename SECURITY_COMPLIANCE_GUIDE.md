# BellaPrep Security & Compliance Guide

Comprehensive guide for security best practices and compliance requirements.

---

## Table of Contents

1. [Security Features Implemented](#security-features-implemented)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [Network Security](#network-security)
5. [Monitoring & Logging](#monitoring--logging)
6. [Compliance Standards](#compliance-standards)
7. [Security Checklist](#security-checklist)
8. [Incident Response](#incident-response)

---

## Security Features Implemented

### ✅ Authentication
- JWT with short-lived access tokens (15 min)
- Refresh token rotation (7 days)
- Password hashing with bcrypt (10 rounds)
- Multi-factor authentication (5 methods)
- Account lockout after failed attempts
- Session management
- Password strength requirements

### ✅ Authorization
- Role-based access control (RBAC)
- 7 hierarchical roles
- Permission-based resource access
- Tenant isolation
- API endpoint protection

### ✅ Data Protection
- Encryption at rest (RDS, S3)
- Encryption in transit (TLS 1.2+)
- Sensitive field encryption (API keys, tokens)
- Secure password storage
- Data sanitization
- SQL injection prevention (Prisma)

### ✅ Network Security
- HTTPS enforcement
- CORS configuration
- Rate limiting
- DDoS protection (AWS Shield)
- Web Application Firewall (WAF) ready
- Security headers

### ✅ Monitoring & Audit
- Complete audit trail
- Real-time logging
- Failed login tracking
- Suspicious activity detection
- CloudWatch integration

---

## Authentication & Authorization

### Password Policy

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Implementation:**
```typescript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

### Multi-Factor Authentication

**Supported Methods:**
1. **TOTP** (Time-based One-Time Password)
   - Google Authenticator
   - Authy
   - 30-second validity window

2. **SMS** (via Twilio)
   - 6-digit code
   - 5-minute expiry

3. **Email** (via SendGrid)
   - 6-digit code
   - 10-minute expiry

4. **WebAuthn** (Biometric)
   - FaceID
   - TouchID
   - YubiKey
   - FIDO2 compliant

5. **Face Recognition**
   - Local embedding storage
   - Encrypted face data
   - Fallback to other methods

### Session Management

**Token Lifecycle:**
```
User Login
  ↓
Generate Access Token (15 min)
Generate Refresh Token (7 days)
  ↓
Access Token Expires
  ↓
Use Refresh Token to get new Access Token
  ↓
Rotate Refresh Token
  ↓
Repeat until Refresh Token expires
  ↓
Require re-login
```

**Token Revocation:**
- Logout invalidates all tokens
- Password change invalidates all tokens
- Admin can revoke user tokens
- Tokens stored with expiry in database

### Role-Based Access Control

**Role Hierarchy:**
```
SUPER_ADMIN (highest)
  ↓
LENDER_ADMIN
  ↓
LOAN_OFFICER
  ↓
PROCESSOR
  ↓
UNDERWRITER
  ↓
CLOSER
  ↓
BORROWER (lowest)
```

**Permission Model:**
- Each endpoint has required role(s)
- Guards enforce role checks
- Permissions inherited hierarchically
- Tenant-scoped permissions

---

## Data Protection

### Encryption at Rest

**Database (RDS PostgreSQL):**
```bash
# Enable encryption
aws rds modify-db-instance \
  --db-instance-identifier bellaprep-db \
  --storage-encrypted \
  --apply-immediately
```

**S3 Bucket:**
```bash
# Enable default encryption
aws s3api put-bucket-encryption \
  --bucket bellaprep-uploads \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

**Application-Level Encryption:**
```typescript
// Encrypt sensitive fields
import { EncryptionUtil } from './utils/encryption.util';

// Store
const encrypted = EncryptionUtil.encrypt(apiKey);
await prisma.integration.update({
  where: { id },
  data: { accessToken: encrypted }
});

// Retrieve
const decrypted = EncryptionUtil.decrypt(integration.accessToken);
```

### Encryption in Transit

**TLS Configuration:**
- Enforce HTTPS only
- TLS 1.2 minimum
- Strong cipher suites
- HTTP Strict Transport Security (HSTS)

**Implementation:**
```typescript
// backend/src/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}
```

### Data Sanitization

**Input Sanitization:**
```typescript
@UsePipes(new SanitizationPipe())
async createUser(@Body() dto: CreateUserDto) {
  // DTO is automatically sanitized
}
```

**XSS Prevention:**
- HTML entity encoding
- Script tag removal
- Event handler stripping
- React automatic escaping

### GDPR Compliance

**Right to Access:**
```typescript
// Export user data
async exportUserData(userId: string): Promise<any> {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      loans: true,
      documents: true,
      auditLogs: true,
    }
  });
  return user;
}
```

**Right to Deletion:**
```typescript
// Delete user data
async deleteUserData(userId: string): Promise<void> {
  await this.prisma.$transaction([
    this.prisma.document.deleteMany({ where: { userId } }),
    this.prisma.loan.deleteMany({ where: { userId } }),
    this.prisma.user.delete({ where: { id: userId } }),
  ]);
}
```

**Data Retention:**
```typescript
// Soft delete with retention period
async softDelete(id: string): Promise<void> {
  await this.prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      // Purge after 90 days
      purgeAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    }
  });
}
```

---

## Network Security

### Rate Limiting

**Per-Endpoint Configuration:**
```typescript
@UseGuards(RateLimitGuard)
@RateLimit({ points: 5, duration: 60000 }) // 5 requests per minute
@Post('login')
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}
```

**Global Rate Limiting:**
```yaml
# serverless.yml
provider:
  apiGateway:
    throttle:
      burstLimit: 200
      rateLimit: 100
```

### CORS Configuration

```typescript
app.enableCors({
  origin: [
    'https://bellaprep.com',
    'https://www.bellaprep.com',
    process.env.FRONTEND_URL,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  maxAge: 3600,
});
```

### Security Headers

**Implemented Headers:**
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `Permissions-Policy`

### Web Application Firewall (WAF)

**AWS WAF Rules:**
```bash
# Create WAF Web ACL
aws wafv2 create-web-acl \
  --name bellaprep-waf \
  --scope REGIONAL \
  --default-action Allow={} \
  --rules file://waf-rules.json
```

**WAF Rules (`waf-rules.json`):**
```json
[
  {
    "Name": "RateLimitRule",
    "Priority": 1,
    "Statement": {
      "RateBasedStatement": {
        "Limit": 2000,
        "AggregateKeyType": "IP"
      }
    },
    "Action": { "Block": {} }
  },
  {
    "Name": "SQLInjectionProtection",
    "Priority": 2,
    "Statement": {
      "ManagedRuleGroupStatement": {
        "VendorName": "AWS",
        "Name": "AWSManagedRulesSQLiRuleSet"
      }
    },
    "OverrideAction": { "None": {} }
  }
]
```

---

## Monitoring & Logging

### Audit Logging

**What's Logged:**
- All authentication attempts
- Authorization failures
- Data modifications (CRUD)
- Configuration changes
- User actions
- System events

**Log Format:**
```json
{
  "timestamp": "2024-11-29T12:00:00Z",
  "userId": "user-123",
  "tenantId": "tenant-456",
  "action": "UPDATE_LOAN",
  "resource": "LOAN",
  "resourceId": "loan-789",
  "changes": {
    "before": { "status": "DRAFT" },
    "after": { "status": "SUBMITTED" }
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

### CloudWatch Integration

**Log Groups:**
- `/aws/lambda/bellaprep-api` - Application logs
- `/aws/rds/instance/bellaprep-db` - Database logs
- `/aws/elasticache/bellaprep-redis` - Redis logs

**Metrics:**
- API latency
- Error rate
- Request count
- Database connections
- Lambda invocations

### Alerts

**Critical Alerts:**
```bash
# High error rate
aws cloudwatch put-metric-alarm \
  --alarm-name bellaprep-high-error-rate \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 50 \
  --comparison-operator GreaterThanThreshold

# Failed login attempts
aws cloudwatch put-metric-alarm \
  --alarm-name bellaprep-failed-logins \
  --metric-name FailedLogins \
  --namespace BellaPrep \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

### Error Tracking

**Sentry Integration:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Capture exceptions
try {
  // code
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

---

## Compliance Standards

### SOC 2 Type II

**Checklist:**
- [x] Access control (RBAC implemented)
- [x] Encryption (at rest and in transit)
- [x] Audit logging (complete trail)
- [x] Change management (version control)
- [x] Monitoring (CloudWatch)
- [ ] Third-party audits (schedule annually)
- [ ] Penetration testing (schedule quarterly)
- [ ] Business continuity plan (document)
- [ ] Disaster recovery plan (document)

### GDPR

**Checklist:**
- [x] Right to access (export data endpoint)
- [x] Right to deletion (delete endpoint)
- [x] Right to rectification (update endpoints)
- [x] Right to portability (JSON export)
- [x] Data minimization (only necessary fields)
- [x] Consent management (user agreements)
- [x] Data breach notification (< 72 hours)
- [x] Privacy by design (multi-tenant isolation)

### PCI DSS (if handling payments)

**Requirements:**
- [ ] Network segmentation
- [ ] Card data encryption
- [ ] Access control
- [ ] Regular security testing
- [ ] Security policy documentation

**Note:** Currently using Stripe, which handles PCI compliance.

### HIPAA (if handling health data)

**Not currently applicable**, but requirements would include:
- BAA with AWS
- Enhanced encryption
- Stricter access controls
- Additional audit requirements

---

## Security Checklist

### Pre-Production

- [ ] All environment variables stored securely
- [ ] Database encryption enabled
- [ ] S3 bucket encryption enabled
- [ ] HTTPS enforced everywhere
- [ ] Rate limiting configured
- [ ] WAF rules deployed
- [ ] Security headers set
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention tested
- [ ] XSS prevention tested
- [ ] CSRF protection enabled
- [ ] Secrets rotation scheduled
- [ ] Backup strategy implemented
- [ ] Disaster recovery tested
- [ ] Monitoring alerts configured
- [ ] Error tracking set up
- [ ] Audit logging verified
- [ ] Penetration testing completed
- [ ] Security documentation complete
- [ ] Incident response plan documented

### Post-Production

- [ ] Monitor CloudWatch dashboards daily
- [ ] Review audit logs weekly
- [ ] Rotate secrets monthly
- [ ] Run penetration tests quarterly
- [ ] Review access controls quarterly
- [ ] Update dependencies monthly
- [ ] Security training for team quarterly
- [ ] Disaster recovery drill annually
- [ ] SOC 2 audit annually

---

## Incident Response

### Response Team

**Roles:**
- **Incident Commander:** Coordinates response
- **Technical Lead:** Investigates and remediates
- **Communications Lead:** Internal and external communications
- **Legal Counsel:** Compliance and legal issues

### Response Process

**1. Detection & Analysis (0-30 minutes)**
- Alert triggers
- Verify incident
- Assess severity
- Activate response team

**2. Containment (30-60 minutes)**
- Isolate affected systems
- Prevent spread
- Preserve evidence
- Document actions

**3. Eradication (1-4 hours)**
- Identify root cause
- Remove threat
- Patch vulnerabilities
- Update security measures

**4. Recovery (4-24 hours)**
- Restore systems
- Verify functionality
- Monitor for recurrence
- Resume normal operations

**5. Post-Incident (24-72 hours)**
- Document lessons learned
- Update procedures
- Notify stakeholders
- File compliance reports

### Breach Notification

**GDPR Requirements:**
- Notify supervisory authority within 72 hours
- Notify affected users without undue delay
- Document the breach

**Notification Template:**
```
Subject: Security Incident Notification

Dear [User],

We are writing to inform you of a security incident that may have affected your personal data.

What Happened:
[Brief description]

What Information Was Involved:
[List affected data]

What We're Doing:
[Response actions]

What You Can Do:
[Recommended actions]

Contact Information:
security@bellaprep.com

Sincerely,
BellaPrep Security Team
```

### Contact Information

**Security Team:**
- Email: security@bellaprep.com
- Emergency Hotline: [Phone Number]
- PGP Key: [Public Key]

---

## Additional Resources

### Security Tools

- **OWASP ZAP** - Vulnerability scanner
- **Snyk** - Dependency vulnerability scanner
- **GitGuardian** - Secret detection
- **Trivy** - Container scanning
- **AWS Inspector** - AWS resource scanning

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [AWS Security Best Practices](https://docs.aws.amazon.com/security/)
- [GDPR Compliance](https://gdpr.eu/)
- [SOC 2 Requirements](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report.html)

---

**Last Updated:** November 29, 2024  
**Version:** 1.0  
**Next Review:** December 29, 2024

