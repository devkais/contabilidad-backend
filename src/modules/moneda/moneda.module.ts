import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moneda } from './moneda.entity';

@Module({
  imports: [
    // Registramos la entidad Moneda
    TypeOrmModule.forFeature([Moneda]),
  ],
  // providers: [MonedaService],
  // controllers: [MonedaController],
  // Exportamos para que la entidad TipoCambio y Cuenta puedan usarla.
  exports: [TypeOrmModule],
})
export class MonedaModule {}
