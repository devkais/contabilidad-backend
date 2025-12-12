import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asiento } from './asiento.entity';
// import { AsientoService } from './asiento.service'; // Se creará después
import { AsientoController } from './asiento.controller';
import { AsientoService } from './asiento.service';
import { EmpresaModule } from '../empresa/empresa.module';
import { GestionModule } from '../gestion/gestion.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    // Registramos la entidad Asiento
    TypeOrmModule.forFeature([Asiento]),
    EmpresaModule,
    GestionModule,
    UsuarioModule,
  ],
  // providers: [AsientoService],
  // controllers: [AsientoController],
  // Exportamos para que DetalleAsiento pueda usarla.
  exports: [AsientoService, TypeOrmModule.forFeature([Asiento])],
  controllers: [AsientoController],
  providers: [AsientoService],
})
export class AsientoModule {}
