import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moneda } from './moneda.entity';
import { MonedaService } from './moneda.service';
import { MonedaController } from './moneda.controller';

@Module({
  imports: [
    // Registramos la entidad Moneda
    TypeOrmModule.forFeature([Moneda]),
  ],
  providers: [MonedaService],
  controllers: [MonedaController],
  // Exportamos para que la entidad TipoCambio y Cuenta puedan usarla.
  // Se exporta el servicio para que otros módulos puedan inyectarlo.
  exports: [MonedaService],
})
export class MonedaModule {}
