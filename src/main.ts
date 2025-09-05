import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  // Buffer logs until the pino logger is ready
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use nestjs-pino logger (pretty in dev, JSON in prod)
  app.useLogger(app.get(Logger));

  // CORS: allow from everywhere (per your requirement)
  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    credentials: false,
    maxAge: 86400,
  });

  // Security headers
  app.use(helmet());

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global, platform-agnostic exception filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // Process-level safety nets (log & keep running)
  const logger = app.get(Logger);
  process.on('unhandledRejection', (reason: any) => {
    logger.error({ err: reason }, 'UNHANDLED REJECTION');
  });
  process.on('uncaughtException', (err: any) => {
    logger.error({ err }, 'UNCAUGHT EXCEPTION');
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`HTTP server listening on http://localhost:${port}`);
}
bootstrap();
