import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';

// Módulos de Seguridad y Contexto
import { AuthModule } from './auth/auth.module'; // <-- RE-ACTIVADO
import { UsuarioModule } from './modules/usuario/usuario.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { GestionModule } from './modules/gestion/gestion.module';
// Nota: Asegúrate de que RolModule y UsuarioEmpresaModule existan físicamente
// import { RolModule } from './modules/rol/rol.module';
// import { UsuarioEmpresaModule } from './modules/usuario-empresa/usuario-empresa.module';

// Módulos de Estructura y Valor
import { MonedaModule } from './modules/moneda/moneda.module';
import { TipoCambioModule } from './modules/tipo-cambio/tipo-cambio.module';
import { CuentaModule } from './modules/cuenta/cuenta.module';

// Módulos de Desagregación y Auditoría
import { CentroCostoModule } from './modules/centro-costo/centro-costo.module';
import { CuentaAuxiliarModule } from './modules/cuenta-auxiliar/cuenta-auxiliar.module';
import { BitacoraModule } from './modules/bitacora/bitacora.module';

// Módulos de Transacción (Núcleo)
import { AsientoModule } from './modules/asiento/asiento.module';
import { DetalleAsientoModule } from './modules/detalle-asiento/detalle-asiento.module';
import { UsuarioEmpresaModule } from './modules/usuario-empresa/usuario-empresa.module';

@Module({
  imports: [
    // 1. CARGA GLOBAL DE VARIABLES DE ENTORNO
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. MÓDULO DE BASE DE DATOS
    DatabaseModule,

    // 3. SEGURIDAD (Núcleo para Guards)
    AuthModule,
    UsuarioModule,

    // 4. CONTEXTO Y ESTRUCTURA
    EmpresaModule,
    GestionModule,
    MonedaModule,
    TipoCambioModule,
    CuentaModule,

    // 5. DESAGREGACIÓN Y AUDITORÍA
    CentroCostoModule,
    CuentaAuxiliarModule,
    BitacoraModule,

    // 6. TRANSACCIÓN CENTRAL
    AsientoModule,
    DetalleAsientoModule,
    UsuarioEmpresaModule,
  ],
})
export class AppModule {}
