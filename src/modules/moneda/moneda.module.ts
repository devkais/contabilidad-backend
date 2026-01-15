import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moneda } from './moneda.entity';
import { MonedaService } from './moneda.service';
import { MonedaController } from './moneda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Moneda])],
  providers: [MonedaService],
  controllers: [MonedaController],
  exports: [MonedaService], // Exportamos para que TipoCambio y Cuenta puedan validar monedas
})
export class MonedaModule {}
