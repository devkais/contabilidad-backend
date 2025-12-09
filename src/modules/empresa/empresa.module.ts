import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';

@Module({
  imports: [
    // Registramos la entidad Empresa
    TypeOrmModule.forFeature([Empresa]),
  ],
  // providers: [EmpresaService],
  // controllers: [EmpresaController],
  // Es importante exportar para que otros módulos (como el de autenticación o gestión) puedan acceder.
  exports: [TypeOrmModule],
})
export class EmpresaModule {}
