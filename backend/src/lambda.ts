import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import serverlessExpress from 'serverless-http';
import { Express } from 'express';
import { AppModule } from './app.module';

let cachedServer: any;

async function bootstrapServer(): Promise<any> {
  if (!cachedServer) {
    const expressApp = require('express')();
    const adapter = new ExpressAdapter(expressApp);
    
    const app = await NestFactory.create(AppModule, adapter, {
      logger: ['error', 'warn'],
    });

    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api');

    await app.init();
    cachedServer = serverlessExpress(expressApp);
  }
  return cachedServer;
}

export const handler = async (event: any, context: any) => {
  const server = await bootstrapServer();
  return server(event, context);
};

