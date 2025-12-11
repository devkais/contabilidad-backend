import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gestion } from './gestion.entity';
import { GestionService } from './gestion.service';
import { GestionController } from './gestion.controller';
import { EmpresaModule } from '../empresa/empresa.module';

@Module({
  imports: [
    // Registramos la entidad Gestion
    TypeOrmModule.forFeature([Gestion]),
    EmpresaModule,
  ],
  providers: [GestionService],
  controllers: [GestionController],
  // Exportamos para que otros módulos (como Cuenta o Asiento) puedan usar su repositorio
  exports: [TypeOrmModule],
})
export class GestionModule {}
