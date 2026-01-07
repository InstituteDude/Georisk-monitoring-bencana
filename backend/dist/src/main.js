"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('GeoRisk Indonesia API')
        .setDescription('API documentation for GeoRisk Indonesia - Disaster Risk Management System')
        .setVersion('1.0')
        .addTag('Disasters', 'Manage disaster zones data')
        .addTag('Reports', 'Handle citizen reports')
        .addTag('Evacuation', 'Evacuation points management')
        .addTag('Auth', 'Authentication and user management')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`
  🚀 GeoRisk Indonesia API is running!
  📍 Local: http://localhost:${port}/api
  📚 Swagger: http://localhost:${port}/api/docs
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map