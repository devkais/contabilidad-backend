import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaAuxiliar } from './cuenta-auxiliar.entity';
// import { CuentaAuxiliarService } from './cuenta-auxiliar.service'; // Se creará después

@Module({
  imports: [
    // Registramos la entidad CuentaAuxiliar
    TypeOrmModule.forFeature([CuentaAuxiliar]),
  ],
  // providers: [CuentaAuxiliarService],
  // controllers: [CuentaAuxiliarController],
  // Exportamos para que DetalleAsiento pueda usarla.
  exports: [TypeOrmModule],
})
export class CuentaAuxiliarModule {}
