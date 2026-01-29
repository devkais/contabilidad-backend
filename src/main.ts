import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS: Configuración para desarrollo con Vite/React
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. PREFIJO GLOBAL: Todas las rutas serán /api/v1/...
  app.setGlobalPrefix('api/v1');

  // 3. FILTRO DE EXCEPCIONES GLOBAL: Centraliza errores para auditoría
  app.useGlobalFilters(new AllExceptionsFilter());

  // 4. PIPES DE VALIDACIÓN: Estricto con DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos no definidos en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay campos no permitidos
      transform: true, // Convierte tipos (ej. string a number en params)
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log('--------------------------------------------------');
  console.log(`🚀 Servidor contable listo en puerto: ${PORT}`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api/v1`);
  console.log('--------------------------------------------------');
}
bootstrap();
