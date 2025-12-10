import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CentroCosto } from './centro-costo.entity';
// import { CentroCostoService } from './centro-costo.service'; // Se creará después

@Module({
  imports: [
    // Registramos la entidad CentroCosto
    TypeOrmModule.forFeature([CentroCosto]),
  ],
  // providers: [CentroCostoService],
  // controllers: [CentroCostoController],
  // Exportamos para que DetalleAsiento pueda usarla.
  exports: [TypeOrmModule],
})
export class CentroCostoModule {}
