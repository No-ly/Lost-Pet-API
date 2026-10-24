import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Rechaza peticiones con propiedades extras
      transform: true, // Transforma automáticamente tipos primitivos
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();