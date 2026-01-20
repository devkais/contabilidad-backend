import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asiento } from './asiento.entity';
import { AsientoService } from './asiento.service';
import { AsientoController } from './asiento.controller';
import { GestionModule } from '../gestion/gestion.module';
import { TasaCambioModule } from '../tasa-cambio/tasa-cambio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asiento]),
    GestionModule,
    TasaCambioModule,
  ],
  providers: [AsientoService],
  controllers: [AsientoController],
})
export class AsientoModule {}
