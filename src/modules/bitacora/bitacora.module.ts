import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bitacora } from './bitacora.entity';
import { BitacoraService } from './bitacora.service'; // Se creará después
import { BitacoraController } from './bitacora.controller'; // Se creará después
import { UsuarioModule } from '../usuario/usuario.module'; // Para registrar el usuario que realiza la acción
import { EmpresaModule } from '../empresa/empresa.module'; // Para registrar la empresa asociada
import { UsuarioEmpresaGestionModule } from '../usuario-empresa-gestion/usuario-empresa-gestion.module';
@Module({
  imports: [
    // Registramos la entidad Bitacora
    TypeOrmModule.forFeature([Bitacora]),
    UsuarioModule,
    EmpresaModule,
    UsuarioEmpresaGestionModule,
  ],
  providers: [BitacoraService],
  controllers: [BitacoraController],
  // Exportamos para que los servicios que manejan datos puedan registrar acciones.
  exports: [TypeOrmModule.forFeature([Bitacora]), BitacoraService],
})
export class BitacoraModule {}
