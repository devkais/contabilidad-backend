import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gestion } from './gestion.entity';

@Module({
  imports: [
    // Registramos la entidad Gestion
    TypeOrmModule.forFeature([Gestion]),
  ],
  // providers: [GestionService],
  // controllers: [GestionController],
  // Exportamos para que otros módulos (como Cuenta o Asiento) puedan usar su repositorio
  exports: [TypeOrmModule],
})
export class GestionModule {}
