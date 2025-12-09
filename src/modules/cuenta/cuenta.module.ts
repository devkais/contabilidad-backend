import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';

@Module({
  imports: [
    // Registramos la entidad Cuenta
    TypeOrmModule.forFeature([Cuenta]),
  ],
  // El servicio de Cuenta es crítico para navegar la jerarquía y validar asientos.
  // providers: [CuentaService],
  // controllers: [CuentaController],
  exports: [TypeOrmModule],
})
export class CuentaModule {}
