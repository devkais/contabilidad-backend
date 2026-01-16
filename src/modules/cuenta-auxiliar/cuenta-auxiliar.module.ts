import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaAuxiliar } from './cuenta-auxiliar.entity';
import { CuentaAuxiliarService } from './cuenta-auxiliar.service';
import { CuentaAuxiliarController } from './cuenta-auxiliar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CuentaAuxiliar])],
  providers: [CuentaAuxiliarService],
  controllers: [CuentaAuxiliarController],
  exports: [CuentaAuxiliarService],
})
export class CuentaAuxiliarModule {}
