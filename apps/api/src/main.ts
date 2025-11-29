import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5175'],
    credentials: true,
  });
  
  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  // API prefix
  app.setGlobalPrefix('api/v1');
  
  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('BellaPrep API')
      .setDescription('Multi-tenant mortgage loan application platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('tenants', 'Tenant/Lender management')
      .addTag('loans', 'Loan application management')
      .addTag('products', 'Loan product configuration')
      .addTag('forms', 'Form builder')
      .addTag('documents', 'Document management')
      .addTag('integrations', 'Third-party integrations')
      .addTag('audit', 'Audit logging')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 BellaPrep API running on port ${port}`);
}

bootstrap();

