import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoAsiento } from './tipo-asiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoAsiento])],
  exports: [TypeOrmModule],
})
export class TipoAsientoModule {}
