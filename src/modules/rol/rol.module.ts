import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { RolService } from './rol.service'; // Se creará después
import { RolController } from './rol.controller'; // Se creará después

@Module({
  imports: [
    // Registramos la entidad Rol con TypeORM
    TypeOrmModule.forFeature([Rol]),
  ],
  providers: [RolService],
  controllers: [RolController],
  // Exportamos para que otros módulos puedan usar el repositorio de Rol
  exports: [TypeOrmModule],
})
export class RolModule {}
