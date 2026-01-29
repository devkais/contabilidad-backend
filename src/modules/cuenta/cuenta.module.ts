import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';
import { CuentaController } from './cuenta.controller';
import { CuentaService } from './cuenta.service';
import { EmpresaModule } from '../empresa/empresa.module';
import { MonedaModule } from '../moneda/moneda.module';
import { UsuarioEmpresaGestionModule } from '../usuario-empresa-gestion/usuario-empresa-gestion.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Cuenta]),
    EmpresaModule,
    MonedaModule,
    UsuarioEmpresaGestionModule,
  ],
  providers: [CuentaService],
  controllers: [CuentaController],
  exports: [CuentaService], // Exportamos para validaciones en otros servicios
})
export class CuentaModule {}
