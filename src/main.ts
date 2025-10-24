import './instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { collectDefaultMetrics } from 'prom-client';

export const SENTRY_DSN = process.env.SENTRY_DSN || '';

// Inicializar métricas por defecto de prom-client
collectDefaultMetrics();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    dsn:
      process.env.SENTRY_DSN ||
      'https://fa6da00d5a3972a3eed3f0f7ab562c0e@o4510184038727680.ingest.de.sentry.io/4510184059502672',
    integrations: [
      nodeProfilingIntegration(),
      // Send console.log, console.warn, and console.error calls as logs to Sentry
      Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
    ],
    // Enable logs to be sent to Sentry
    enableLogs: true,
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Profiling
    profilesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}

void bootstrap();
