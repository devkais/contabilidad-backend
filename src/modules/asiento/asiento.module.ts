import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asiento } from './asiento.entity';
// import { AsientoService } from './asiento.service'; // Se creará después
import { AsientoController } from './asiento.controller';
//import { AsientoService } from './asiento/asiento.service';
import { Service } from './.service';

@Module({
  imports: [
    // Registramos la entidad Asiento
    TypeOrmModule.forFeature([Asiento]),
  ],
  // providers: [AsientoService],
  // controllers: [AsientoController],
  // Exportamos para que DetalleAsiento pueda usarla.
  exports: [TypeOrmModule],
  controllers: [AsientoController],
  providers: [Service],
})
export class AsientoModule {}
