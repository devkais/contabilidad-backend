import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gestion } from './gestion.entity';
import { GestionService } from './gestion.service';
import { GestionController } from './gestion.controller';
import { EmpresaModule } from '../empresa/empresa.module';
import { UsuarioEmpresaGestionModule } from '../usuario-empresa-gestion/usuario-empresa-gestion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gestion]),
    EmpresaModule, // Requerido para validar id_empresa
    UsuarioEmpresaGestionModule, // Requerido para validar usuario-empresa-gestion
  ],
  providers: [GestionService],
  controllers: [GestionController],
  exports: [GestionService],
})
export class GestionModule {}
