// src/modules/cuentas/cuenta.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';
import { CuentaController } from './cuenta.controller';
import { CuentaService } from './cuenta.service';
import { EmpresaModule } from '../empresa/empresa.module';
import { GestionModule } from '../gestion/gestion.module';
import { MonedaModule } from '../moneda/moneda.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cuenta]),
    EmpresaModule, // Aunque no se usan directamente, es bueno registrarlas
    GestionModule,
    MonedaModule,
  ],
  providers: [CuentaService],
  controllers: [CuentaController],
  exports: [TypeOrmModule.forFeature([Cuenta]), CuentaService],
})
export class CuentaModule {}
