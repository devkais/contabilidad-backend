import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleAsiento } from './detalle-asiento.entity';

@Module({
  imports: [
    // Registramos la entidad DetalleAsiento
    TypeOrmModule.forFeature([DetalleAsiento]),
  ],
  // providers: [DetalleAsientoService],
  // controllers: [DetalleAsientoController],
  // Exportamos
  exports: [TypeOrmModule],
})
export class DetalleAsientoModule {}
