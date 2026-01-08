// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module'; // Ruta a DB

// --- MÓDULOS DE NEGOCIO (Rutas ajustadas a './modules/...') ---

// 1. Módulos de Seguridad y Contexto
import { RolModule } from './modules/rol/rol.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { GestionModule } from './modules/gestion/gestion.module';
import { UsuarioEmpresaModule } from './modules/usuario-empresa/usuario-empresa.module'; // <-- NUEVO

// 2. Módulos de Estructura y Valor
import { MonedaModule } from './modules/moneda/moneda.module';
import { TipoCambioModule } from './modules/tipo-cambio/tipo-cambio.module';
import { CuentaModule } from './modules/cuenta/cuenta.module';

// 3. Módulos de Desagregación y Auditoría
import { CentroCostoModule } from './modules/centro-costo/centro-costo.module'; // <-- NUEVO
import { CuentaAuxiliarModule } from './modules/cuenta-auxiliar/cuenta-auxiliar.module'; // <-- NUEVO
import { BitacoraModule } from './modules/bitacora/bitacora.module'; // <-- NUEVO

// 4. Módulos de Transacción (Núcleo)
import { AsientoModule } from './modules/asiento/asiento.module';
import { DetalleAsientoModule } from './modules/detalle-asiento/detalle-asiento.module';

// cnoexion
//import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    // 1. CARGA GLOBAL DE VARIABLES DE ENTORNO
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. MÓDULO DE BASE DE DATOS
    DatabaseModule,

    // 3. MÓDULOS DE NEGOCIO

    // Seguridad y Contexto
    RolModule,
    UsuarioModule,
    EmpresaModule,
    GestionModule,
    UsuarioEmpresaModule, // Nuevo módulo pivote

    // Estructura y Valor
    MonedaModule,
    TipoCambioModule,
    CuentaModule,

    // Desagregación y Auditoría
    CentroCostoModule, // Nuevo
    CuentaAuxiliarModule, // Nuevo
    BitacoraModule, // Nuevo

    // Transacción Central
    AsientoModule,
    DetalleAsientoModule,
    /// conexion
    //AuthModule,

    // --- MÓDULO ELIMINADO: TipoAsientoModule (ya no es necesario) ---
  ],
})
export class AppModule {}
