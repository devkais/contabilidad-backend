import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
// import { UsuarioService } from './usuario.service'; // Se creará después

@Module({
  imports: [
    // Registramos la entidad Usuario
    TypeOrmModule.forFeature([Usuario]),
  ],
  // providers: [UsuarioService],
  // controllers: [UsuarioController],

  // Es CRÍTICO exportar TypeOrmModule y potencialmente el UsuarioService,
  // para que el módulo de Autenticación pueda inyectar y usar el repositorio de Usuario.
  exports: [TypeOrmModule],
})
export class UsuarioModule {}
