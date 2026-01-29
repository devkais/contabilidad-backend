import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DetalleAsientoService } from './detalle-asiento.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmpresaGestionGuard } from '../../auth/guards/empresa-gestion.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('detalle-asiento')
@UseGuards(JwtAuthGuard, EmpresaGestionGuard)
export class DetalleAsientoController {
  constructor(private readonly detalleService: DetalleAsientoService) {}

  /**
   * Endpoint para el Libro Mayor de una cuenta.
   */
  @Get('cuenta/:id_cuenta')
  async getMayor(
    @Param('id_cuenta', ParseIntPipe) idCuenta: number,
    @GetUser() user: UserRequest,
  ) {
    return await this.detalleService.getMovimientosByCuenta(
      idCuenta,
      user.id_empresa,
      user.id_gestion,
    );
  }

  /**
   * Totales generales de la gestión actual.
   */
  @Get('totales-gestion')
  async getTotales(@GetUser() user: UserRequest) {
    return await this.detalleService.getTotalesByGestion(
      user.id_empresa,
      user.id_gestion,
    );
  }
}
