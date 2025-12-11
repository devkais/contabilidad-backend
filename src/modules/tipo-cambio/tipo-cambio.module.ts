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
    MonedaModule, // Se importa para que este módulo pueda inyectar MonedaService
  ],
  providers: [TipoCambioService],
  controllers: [TipoCambioController],
  // Exportamos para que la lógica de Asiento pueda consultar los tipos de cambio.
  exports: [TipoCambioService],
})
export class TipoCambioModule {}
