import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from './cuenta.entity';
// import { CuentaService } from './cuenta.service'; // Se creará después

@Module({
  imports: [
    // Registramos la entidad Cuenta
    TypeOrmModule.forFeature([Cuenta]),
  ],
  // providers: [CuentaService],
  // controllers: [CuentaController],
  // Exportamos para que los módulos de Asiento y DetalleAsiento puedan usarla.
  exports: [TypeOrmModule],
})
export class CuentaModule {}
