import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaAuxiliar } from './cuenta-auxiliar.entity';
import { CuentaAuxiliarController } from './cuenta-auxiliar.controller';
import { CuentaAuxiliarService } from './cuenta-auxiliar.service';
import { EmpresaModule } from '../empresa/empresa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CuentaAuxiliar]),
    EmpresaModule, // Al importar EmpresaModule, tenemos acceso a EmpresaService
  ],
  providers: [CuentaAuxiliarService],
  controllers: [CuentaAuxiliarController],
  exports: [TypeOrmModule.forFeature([CuentaAuxiliar]), CuentaAuxiliarService],
})
export class CuentaAuxiliarModule {}
