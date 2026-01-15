import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gestion } from './gestion.entity';
import { GestionService } from './gestion.service';
import { GestionController } from './gestion.controller';
import { EmpresaModule } from '../empresa/empresa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gestion]),
    EmpresaModule, // Requerido para validar id_empresa
  ],
  providers: [GestionService],
  controllers: [GestionController],
  exports: [GestionService],
})
export class GestionModule {}
