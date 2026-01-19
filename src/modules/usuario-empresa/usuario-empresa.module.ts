import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEmpresaService } from './usuario-empresa.service';
import { UsuarioEmpresaController } from './usuario-empresa.controller';
import { UsuarioEmpresa } from './usuario-empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEmpresa])],
  controllers: [UsuarioEmpresaController],
  providers: [UsuarioEmpresaService],
  exports: [UsuarioEmpresaService], // Permite que otros módulos (como Auth) lo inyecten
})
export class UsuarioEmpresaModule {}
