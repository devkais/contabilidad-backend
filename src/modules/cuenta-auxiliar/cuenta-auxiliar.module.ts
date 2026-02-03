import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaAuxiliar } from './cuenta-auxiliar.entity';
import { CuentaAuxiliarService } from './cuenta-auxiliar.service';
import { CuentaAuxiliarController } from './cuenta-auxiliar.controller';
import { UsuarioEmpresaGestionModule } from '../usuario-empresa-gestion/usuario-empresa-gestion.module';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([CuentaAuxiliar, DetalleAsiento]),
    UsuarioEmpresaGestionModule,
  ],
  providers: [CuentaAuxiliarService],
  controllers: [CuentaAuxiliarController],
  exports: [CuentaAuxiliarService],
})
export class CuentaAuxiliarModule {}
