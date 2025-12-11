import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';
import { EmpresaController } from './controllers/empresa.controller';
import { EmpresaService } from './services/empresa.service';

@Module({
  imports: [
    // Registramos la entidad Empresa
    TypeOrmModule.forFeature([Empresa]),
  ],
  providers: [EmpresaService],
  controllers: [EmpresaController],
  exports: [TypeOrmModule, EmpresaService],
})
export class EmpresaModule {}
