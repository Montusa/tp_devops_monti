/*
import './instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Inicializar Sentry
  Sentry.init({
    dsn: process.env.SENTRY_DSN || 'TU_DSN_AQUI', // Reemplazar con tu DSN
    integrations: [nodeProfilingIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Captura 100% de las transacciones (para desarrollo/testing)
    // Profiling
    profilesSampleRate: 1.0, // Captura 100% de los profiles
    environment: process.env.NODE_ENV || 'development',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}

void bootstrap();
