import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CentroCosto } from './centro-costo.entity';
import { CentroCostoService } from './centro-costo.service';
import { CentroCostoController } from './centro-costo.controller';
import { UsuarioEmpresaGestionModule } from '../usuario-empresa-gestion/usuario-empresa-gestion.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([CentroCosto]),
    UsuarioEmpresaGestionModule,
  ],
  providers: [CentroCostoService],
  controllers: [CentroCostoController],
  exports: [CentroCostoService],
})
export class CentroCostoModule {}
