import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';
import { EmpresaController } from './controllers/empresa.controller';
import { EmpresaService } from './services/empresa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])],
  providers: [EmpresaService],
  controllers: [EmpresaController],
  exports: [EmpresaService], // Exportamos el servicio para otros módulos
})
export class EmpresaModule {}
