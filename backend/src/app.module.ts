import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { FormsModule } from './modules/forms/forms.module';
import { LoansModule } from './modules/loans/loans.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { QrModule } from './modules/qr/qr.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { PlaidModule } from './modules/plaid/plaid.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    PrismaModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    ProductsModule,
    FormsModule,
    LoansModule,
    IntegrationsModule,
    QrModule,
    AnalyticsModule,
    AuditModule,
    NotificationsModule,
    CalendarModule,
    PlaidModule,
  ],
})
export class AppModule {}

