import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';

@Module({
  imports: [
    // Registramos la entidad Usuario para su uso
    TypeOrmModule.forFeature([Usuario]),
  ],
  // Aquí irían el servicio y controlador del usuario:
  // providers: [UsuarioService],
  // controllers: [UsuarioController],
  exports: [TypeOrmModule],
})
export class UsuarioModule {}
