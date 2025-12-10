import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';
import { AsientoModule } from './modules/asiento/asiento.module';
import { CuentaModule } from './modules/cuenta/cuenta.module';
import { DetalleAsientoModule } from './modules/detalle-asiento/detalle-asiento.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { GestionModule } from './modules/gestion/gestion.module';
import { MonedaModule } from './modules/moneda/moneda.module';
import { RolModule } from './modules/rol/rol.module';
import { TipoAsientoModule } from './modules/tipo-asiento/tipo-asiento.module';
import { TipoCambioModule } from './modules/tipo-cambio/tipo-cambio.module';
import { UsuarioModule } from './modules/usuario/usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    EmpresaModule, // <-- ¡IMPORTANTE! Añade esta línea
    UsuarioModule,
    RolModule,
    GestionModule,
    MonedaModule,
    TipoCambioModule,
    CuentaModule,
    TipoAsientoModule,
    AsientoModule,
    DetalleAsientoModule,
  ],
})
export class AppModule {}
