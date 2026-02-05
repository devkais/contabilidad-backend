import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { UsuarioEmpresaGestionModule } from '../usuario-empresa-gestion/usuario-empresa-gestion.module';
import { Gestion } from '../gestion/gestion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Empresa, Gestion]),
    UsuarioEmpresaGestionModule,
  ],
  providers: [EmpresaService],
  controllers: [EmpresaController],
  exports: [EmpresaService], // Exportamos el servicio para otros módulos
})
export class EmpresaModule {}
