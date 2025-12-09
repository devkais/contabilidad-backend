import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleAsiento } from './detalle-asiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleAsiento])],
  exports: [TypeOrmModule],
})
export class DetalleAsientoModule {}
