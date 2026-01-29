import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { ReportesController } from './reportes.controller';
//import { ReportesService } from './reportes.service';
import { Cuenta } from '../cuenta/cuenta.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Module({
  imports: [
    // Debes importar las entidades que el Servicio usa con @InjectRepository
    TypeOrmModule.forFeature([Cuenta, DetalleAsiento]),
  ],
  //controllers: [ReportesController],
  //providers: [ReportesService],
})
export class ReportesModule {}
