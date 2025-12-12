import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 1. Entidades y Componentes del Módulo DetalleAsiento
import { DetalleAsiento } from './detalle-asiento.entity';
import { DetalleAsientoService } from './detalle-asiento.service';
import { DetalleAsientoController } from './detalle-asiento.controller';

// 2. Módulos de las Llaves Foráneas (FKs)
// Deben EXPORTAR sus respectivos servicios.
import { AsientoModule } from '../asiento/asiento.module';
import { CuentaModule } from '../cuenta/cuenta.module';
import { CuentaAuxiliarModule } from '../cuenta-auxiliar/cuenta-auxiliar.module';
import { CentroCostoModule } from '../centro-costo/centro-costo.module';

@Module({
  imports: [
    // ⬇️ 1. Registrar el repositorio de la entidad DetalleAsiento
    TypeOrmModule.forFeature([DetalleAsiento]),

    // ⬇️ 2. Importar los CUATRO módulos que proveen las dependencias del servicio
    // Esto resuelve las inyecciones de AsientoService, CuentaService, etc.
    AsientoModule,
    CuentaModule,
    CuentaAuxiliarModule,
    CentroCostoModule,
  ],
  controllers: [DetalleAsientoController],
  providers: [DetalleAsientoService],
  // ⬇️ Opcional: Si otros módulos necesitarán DetalleAsientoService o el Repositorio
  // exports: [DetalleAsientoService, TypeOrmModule.forFeature([DetalleAsiento])],
})
export class DetalleAsientoModule {}
