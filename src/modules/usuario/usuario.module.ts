// src/modules/usuario/usuario.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { UsuarioController } from './controllers/usuario.controller';
import { UsuarioService } from './services/usuario.service';
// Importa las otras entidades si son necesarias para forFeature
// import { Rol } from './entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsuarioService],
  controllers: [UsuarioController],
  // Exportar el servicio es CLAVE para que AuthModule pueda inyectarlo
  exports: [TypeOrmModule.forFeature([Usuario]), UsuarioService],
})
export class UsuarioModule {}
