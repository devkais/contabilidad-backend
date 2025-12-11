import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEmpresa } from './usuario-empresa.entity';
import { UsuarioEmpresaController } from './controller/usuario-empresa.controller';
import { UsuarioEmpresaService } from './services/usuario-empresa.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEmpresa])],
  controllers: [UsuarioEmpresaController],
  providers: [UsuarioEmpresaService],
})
export class UsuarioEmpresaModule {}
