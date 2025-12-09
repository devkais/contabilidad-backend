import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // Hacemos que la inyección de ConfigService sea posible
      imports: [ConfigModule],

      // La función useFactory es donde definimos las opciones de conexión
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb', // Driver
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        // Aquí especificamos dónde están todas nuestras Entidades de Contabilidad
        // La ruta 'dist/**/*.entity{.ts,.js}' le dice a Nest/TypeORM
        // que busque cualquier archivo que termine en '.entity.ts' o '.entity.js'
        // en la carpeta de compilación (dist).
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],

        // ¡IMPORTANTE! Solo 'true' en desarrollo. Debería ser 'false' en producción.
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'false',

        // Muestra las consultas SQL en la consola
        logging: configService.get<string>('DB_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
