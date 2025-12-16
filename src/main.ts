// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Añadir para validación global

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CONFIGURACIÓN DE CORS (CRÍTICO PARA LA CONEXIÓN FRONTEND)
  // Permitimos solicitudes desde tu frontend Vite (puerto 5173 es el default de Vite)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Añadir tu dominio real aquí si tienes uno
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Importante para Cookies o JWT en headers
  });

  // 2. PREFIJO GLOBAL DE LA API (Recomendado)
  app.setGlobalPrefix('api/v1');
  // Ahora, todas tus rutas serán accesibles en: http://localhost:3000/api/v1/usuarios

  // 3. PIPES DE VALIDACIÓN GLOBAL
  // Esto asegura que todos tus DTOs (Create, Update) sean validados automáticamente.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades desconocidas
      transform: true, // Transforma los payloads a las instancias de los DTOs
    }),
  );

  // El puerto se lee de .env, que ya tienes configurado en app.module.ts
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}/api/v1`);
}
bootstrap();
