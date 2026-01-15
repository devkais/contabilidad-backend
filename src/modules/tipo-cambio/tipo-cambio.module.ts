import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCambio } from './tipo-cambio.entity';
import { TipoCambioService } from './tipo-cambio.service';
import { TipoCambioController } from './tipo-cambio.controller';
import { MonedaModule } from '../moneda/moneda.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoCambio]),
    MonedaModule, // Necesario para validar id_moneda_destino
  ],
  providers: [TipoCambioService],
  controllers: [TipoCambioController],
  exports: [TipoCambioService],
})
export class TipoCambioModule {}
