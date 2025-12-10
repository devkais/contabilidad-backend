import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCambio } from './tipo-cambio.entity';
//import { MonedaModule } from '../moneda/moneda.module'; // Necesario si el servicio de TipoCambio lo usa

@Module({
  imports: [
    // Registramos la entidad TipoCambio
    TypeOrmModule.forFeature([TipoCambio]),
    // MonedaModule, // Se importa si el servicio de TipoCambio necesita inyectar MonedaRepository
  ],
  // providers: [TipoCambioService],
  // controllers: [TipoCambioController],
  // Exportamos para que la lógica de Asiento pueda consultar los tipos de cambio.
  exports: [TypeOrmModule],
})
export class TipoCambioModule {}
