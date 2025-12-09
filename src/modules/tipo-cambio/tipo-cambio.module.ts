import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCambio } from './tipo-cambio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCambio])],
  exports: [TypeOrmModule],
})
export class TipoCambioModule {}
