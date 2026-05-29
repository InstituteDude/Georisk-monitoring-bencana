import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const compression = require('compression');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Gzip all responses — critical for large GeoJSON payloads
  app.use(compression());

  // Enable CORS for frontend
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(',').map(o => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
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

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger Documentation configuration
  const config = new DocumentBuilder()
    .setTitle('GeoRisk Indonesia API')
    .setDescription('API documentation for GeoRisk Indonesia - Disaster Risk Management System')
    .setVersion('1.0')
    .addTag('Disasters', 'Manage disaster zones data')
    .addTag('Reports', 'Handle citizen reports')
    .addTag('Evacuation', 'Evacuation points management')
    .addTag('Auth', 'Authentication and user management')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Allow large GeoJSON imports (up to 300MB) with extended timeout
  app.getHttpServer().setTimeout(300_000); // 5 minutes

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`
  🚀 GeoRisk Indonesia API is running!
  📍 Local: http://localhost:${port}/api
  📚 Swagger: http://localhost:${port}/api/docs
  `);
}

bootstrap();
