// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <-- ¡IMPORTANTE!
import { DatabaseModule } from './db/database.module';

// Importación de todos tus módulos de negocio
import { RolModule } from './modules/rol/rol.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AsientoModule } from './modules/asiento/asiento.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { GestionModule } from './modules/gestion/gestion.module';
// Asumo que estos módulos usan Entidades (aunque algunos nombres no suenen a Entity)
import { TipoAsientoModule } from './modules/tipo-asiento/tipo-asiento.module';
import { DetalleAsientoModule } from './modules/detalle-asiento/detalle-asiento.module';
import { MonedaModule } from './modules/moneda/moneda.module';
import { TipoCambioModule } from './modules/tipo-cambio/tipo-cambio.module';
import { CuentaModule } from './modules/cuenta/cuenta.module';

@Module({
  imports: [
    // 1. CARGA GLOBAL DE VARIABLES DE ENTORNO
    // Esto hace que ConfigService pueda leer el .env antes de que TypeORM se inicialice.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Especifica la ruta si no está en la raíz
    }),

    // 2. MÓDULO DE BASE DE DATOS (depende de la configuración ya cargada)
    DatabaseModule,

    // 3. MÓDULOS DE NEGOCIO
    RolModule,
    UsuarioModule,
    AsientoModule,
    EmpresaModule,
    GestionModule,
    TipoAsientoModule,
    DetalleAsientoModule,
    MonedaModule,
    TipoCambioModule,
    CuentaModule,
  ],
})
export class AppModule {}
