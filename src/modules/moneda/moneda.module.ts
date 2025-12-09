import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moneda } from './moneda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Moneda])],
  exports: [TypeOrmModule],
})
export class MonedaModule {}
