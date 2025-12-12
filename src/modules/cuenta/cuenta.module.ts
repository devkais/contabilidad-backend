// src/modules/cuentas/cuenta.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';
import { CuentaController } from './cuenta.controller';
import { CuentaService } from './cuenta.service';
// Importamos las entidades FKs para el registro (aunque no se usen en este módulo)
import { Empresa } from '../empresa/empresa.entity';
import { Gestion } from '../gestion/gestion.entity';
import { Moneda } from '../moneda/moneda.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cuenta]),
    Empresa, // Aunque no se usan directamente, es bueno registrarlas
    Gestion,
    Moneda,
  ],
  providers: [CuentaService],
  controllers: [CuentaController],
  // Exportar el servicio es fundamental para que ContabilidadModule lo use para validar cuentas
  exports: [TypeOrmModule.forFeature([Cuenta]), CuentaService],
})
export class CuentaModule {}
