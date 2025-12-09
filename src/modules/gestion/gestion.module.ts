import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gestion } from './gestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gestion])],
  exports: [TypeOrmModule],
})
export class GestionModule {}
