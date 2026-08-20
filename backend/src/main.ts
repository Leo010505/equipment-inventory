import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Habilitar CORS para permitir conexión con el Frontend ---
  app.enableCors();

  // Mantenemos tus validaciones intactas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- Configuración de Swagger ---
  const config = new DocumentBuilder()
    .setTitle('Equipment Inventory API')
    .setDescription('API para la gestión de inventario de equipos de cómputo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Ruta exacta solicitada en la prueba: localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();