import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { Handler, Context, Callback } from 'aws-lambda';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
      logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug'],
    });

    const configService = app.get(ConfigService);

    // Security
    app.use(helmet());
    app.enableCors({
      origin: configService.get('FRONTEND_URL') || '*',
      credentials: true,
    });

    // Global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // API versioning
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    // Swagger API documentation
    if (process.env.NODE_ENV !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('BellaPrep API')
        .setDescription('Multi-Tenant SaaS API for Mortgage Application Platform')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication & Authorization')
        .addTag('tenants', 'Tenant Management')
        .addTag('users', 'User Management')
        .addTag('loans', 'Loan Applications')
        .addTag('products', 'Loan Products')
        .addTag('forms', 'Form Builder')
        .addTag('integrations', 'Third-party Integrations')
        .addTag('qr', 'QR Code Management')
        .addTag('analytics', 'Analytics & Reporting')
        .addTag('audit', 'Audit Logs')
        .addTag('notifications', 'Notifications')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document);
    }

    await app.init();
    cachedServer = expressApp as any;
  }

  return cachedServer;
}

// For local development
export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || '*',
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('BellaPrep API')
    .setDescription('Multi-Tenant SaaS API for Mortgage Application Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

// AWS Lambda handler
export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  const server = await bootstrapServer();
  const serverlessExpress = require('@vendia/serverless-express');
  return serverlessExpress({ app: server })(event, context, callback);
};

// Start server if not in Lambda environment
if (require.main === module) {
  bootstrap();
}

