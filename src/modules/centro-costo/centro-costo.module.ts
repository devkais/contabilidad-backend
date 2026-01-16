import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CentroCosto } from './centro-costo.entity';
import { CentroCostoService } from './centro-costo.service';
import { CentroCostoController } from './centro-costo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CentroCosto])],
  providers: [CentroCostoService],
  controllers: [CentroCostoController],
  exports: [CentroCostoService],
})
export class CentroCostoModule {}
