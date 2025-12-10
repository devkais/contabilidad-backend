import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';
import { EmpresaController } from './controllers/empresa.controller';
import { EmpresaService } from './services/empresa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [TypeOrmModule],
})
export class EmpresaModule {}
