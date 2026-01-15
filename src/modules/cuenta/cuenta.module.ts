import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';
import { CuentaController } from './cuenta.controller';
import { CuentaService } from './cuenta.service';
import { EmpresaModule } from '../empresa/empresa.module';
import { MonedaModule } from '../moneda/moneda.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cuenta]), EmpresaModule, MonedaModule],
  providers: [CuentaService],
  controllers: [CuentaController],
  exports: [CuentaService], // Exportamos para validaciones en otros servicios
})
export class CuentaModule {}
