import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCambio } from './tipo-cambio.entity';
import { TipoCambioController } from './tipo-cambio.controller';
import { TipoCambioService } from './tipo-cambio.service';
import { MonedaModule } from '../moneda/moneda.module';

@Module({
  imports: [
    // Registramos la entidad TipoCambio
    TypeOrmModule.forFeature([TipoCambio]),
    MonedaModule,
    // MonedaModule, // Se importa si el servicio de TipoCambio necesita inyectar MonedaRepository
  ],
  providers: [TipoCambioService],
  controllers: [TipoCambioController],
  // Exportamos para que la lógica de Asiento pueda consultar los tipos de cambio.
  exports: [TypeOrmModule, TipoCambioService],
})
export class TipoCambioModule {}
