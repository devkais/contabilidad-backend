import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleAsiento } from './detalle-asiento.entity';
import { DetalleAsientoService } from './detalle-asiento.service';
import { DetalleAsientoController } from './detalle-asiento.controller';
import { CuentaModule } from '../cuenta/cuenta.module';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleAsiento]), CuentaModule],
  providers: [DetalleAsientoService],
  controllers: [DetalleAsientoController],
  exports: [DetalleAsientoService],
})
export class DetalleAsientoModule {}
