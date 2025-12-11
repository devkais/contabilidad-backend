import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEmpresa } from './usuario-empresa.entity';
import { UsuarioEmpresaService } from './usuario-empresa.service';
import { UsuarioEmpresaController } from './usuario-empersa.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { EmpresaModule } from '../empresa/empresa.module';
import { RolModule } from '../rol/rol.module';

@Module({
  imports: [
    // Registramos la entidad UsuarioEmpresa
    TypeOrmModule.forFeature([UsuarioEmpresa]),
    UsuarioModule,
    EmpresaModule,
    RolModule,
  ],
  providers: [UsuarioEmpresaService],
  controllers: [UsuarioEmpresaController],
  // Exportamos para que la lógica de Autenticación pueda acceder a esta tabla.
  exports: [TypeOrmModule],
})
export class UsuarioEmpresaModule {}
