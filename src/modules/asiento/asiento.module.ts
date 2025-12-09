import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asiento } from './asiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asiento])],
  exports: [TypeOrmModule],
})
export class AsientoModule {}
