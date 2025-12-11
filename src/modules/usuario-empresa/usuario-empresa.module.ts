import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEmpresa } from './usuario-empresa.entity';

@Module({
  imports: [
    // Registramos la entidad UsuarioEmpresa
    TypeOrmModule.forFeature([UsuarioEmpresa]),
  ],
  // providers: [UsuarioEmpresaService],
  // controllers: [UsuarioEmpresaController],
  // Exportamos para que la lógica de Autenticación pueda acceder a esta tabla.
  exports: [TypeOrmModule],
})
export class UsuarioEmpresaModule {}
