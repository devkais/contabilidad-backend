import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEmpresaGestionService } from './usuario-empresa-gestion.service';
import { UsuarioEmpresaGestionController } from './usuario-empresa-gestion.controller';
import { UsuarioEmpresaGestion } from './usuario-empresa-gestion.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEmpresaGestion])],
  controllers: [UsuarioEmpresaGestionController],
  providers: [UsuarioEmpresaGestionService],
  exports: [UsuarioEmpresaGestionService, TypeOrmModule], // Permite que otros módulos (como Auth) lo inyecten
})
export class UsuarioEmpresaGestionModule {}
