import { Controller, Get, UseGuards } from '@nestjs/common';
import { BitacoraService } from './bitacora.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmpresaGestionGuard } from '../../auth/guards/empresa-gestion.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('bitacora')
@UseGuards(JwtAuthGuard, EmpresaGestionGuard)
export class BitacoraController {
  constructor(private readonly bitacoraService: BitacoraService) {}

  @Get()
  async getLogs(@GetUser() user: UserRequest) {
    // Retorna el historial de acciones de la empresa actual
    return await this.bitacoraService.findAllByEmpresa(user.id_empresa);
  }

  // Nota: No existen métodos POST, PATCH o DELETE aquí por integridad de auditoría.
}
