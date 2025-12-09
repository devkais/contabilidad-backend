import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedData } from './db/seed-data';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get<DataSource>('DATA_SOURCE');

  const seedData = new SeedData(dataSource);
  await seedData.run();

  await app.close();
  process.exit(0);
}

bootstrap().catch((error) => {
  console.error('Error ejecutando seed:', error);
  process.exit(1);
});
