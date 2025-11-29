import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UserModule } from './modules/user/user.module';
import { LoanModule } from './modules/loan/loan.module';
import { ProductModule } from './modules/product/product.module';
import { FormModule } from './modules/form/form.module';
import { DocumentModule } from './modules/document/document.module';
import { AuditModule } from './modules/audit/audit.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { QrModule } from './modules/qr/qr.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),
    
    // Database
    PrismaModule,
    
    // Feature modules
    AuthModule,
    TenantModule,
    UserModule,
    LoanModule,
    ProductModule,
    FormModule,
    DocumentModule,
    AuditModule,
    IntegrationModule,
    QrModule,
    NotificationModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

