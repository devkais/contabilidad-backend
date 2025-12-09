import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asiento } from './asiento.entity';
// import { AsientoService } from './asiento.service'; // Se creará después

@Module({
  imports: [
    // Registramos la entidad Asiento
    TypeOrmModule.forFeature([Asiento]),
  ],
  // providers: [AsientoService],
  // controllers: [AsientoController],
  // Exportamos para que DetalleAsiento pueda usarla.
  exports: [TypeOrmModule],
})
export class AsientoModule {}
