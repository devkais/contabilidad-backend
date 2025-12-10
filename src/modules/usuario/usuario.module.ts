// src/modules/usuario/usuario.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
// Importa las otras entidades si son necesarias para forFeature
// import { Rol } from './entities/rol.entity';

import { UsuarioService } from './services/usuario.service';
import { UsuarioController } from './controllers/usuario.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      // Otras entidades...
    ]),
  ],
  providers: [UsuarioService],
  controllers: [UsuarioController],
  // Exportar el servicio es CLAVE para que AuthModule pueda inyectarlo
  exports: [UsuarioService, TypeOrmModule],
})
export class UsuarioModule {}
