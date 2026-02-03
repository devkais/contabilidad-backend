import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asiento } from './asiento.entity';
import { AsientoService } from './asiento.service';
import { AsientoController } from './asiento.controller';
import { GestionModule } from '../gestion/gestion.module';
import { UsuarioEmpresaGestionModule } from '../usuario-empresa-gestion/usuario-empresa-gestion.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Asiento]),
    GestionModule,
    UsuarioEmpresaGestionModule,
  ],
  providers: [AsientoService],
  controllers: [AsientoController],
})
export class AsientoModule {}
