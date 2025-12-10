import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bitacora } from './bitacora.entity';
// import { BitacoraService } from './bitacora.service'; // Se creará después

@Module({
  imports: [
    // Registramos la entidad Bitacora
    TypeOrmModule.forFeature([Bitacora]),
  ],
  // providers: [BitacoraService],
  // controllers: [BitacoraController],
  // Exportamos para que los servicios que manejan datos puedan registrar acciones.
  exports: [TypeOrmModule],
})
export class BitacoraModule {}
