import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // Hacemos que la inyección de ConfigService sea posible
      imports: [ConfigModule],

      // La función useFactory es donde definimos las opciones de conexión
      useFactory: () => ({
        type: 'mysql', // Driver
        host: 'localhost',
        port: 3307,
        username: 'miguel',
        password: 'root',
        database: 'contabilidad_db',

        // Aquí especificamos dónde están todas nuestras Entidades de Contabilidad
        // La ruta 'dist/**/*.entity{.ts,.js}' le dice a Nest/TypeORM
        // que busque cualquier archivo que termine en '.entity.ts' o '.entity.js'
        // en la carpeta de compilación (dist).
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],

        // ¡IMPORTANTE! Solo 'true' en desarrollo. Debería ser 'false' en producción.
        synchronize: true,

        // Muestra las consultas SQL en la consola
        logging: true,
      }),
    }),
  ],
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: async () => {
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }
        return AppDataSource;
      },
    },
  ],
  exports: ['DATA_SOURCE'],
})
export class DatabaseModule {}
