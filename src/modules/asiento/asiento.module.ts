import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asiento } from './asiento.entity';
import { AsientoService } from './asiento.service';
import { AsientoController } from './asiento.controller';
import { GestionModule } from '../gestion/gestion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Asiento]), GestionModule],
  providers: [AsientoService],
  controllers: [AsientoController],
  exports: [AsientoService],
})
export class AsientoModule {}
