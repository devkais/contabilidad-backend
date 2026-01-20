import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ConsultarBalanceDto } from './dto/consultar-balance.dto';
import { ConsultarResultadosDto } from './dto/consultar-resultados.dto';
import { ConsultarMayorDto } from './dto/consultar-mayor.dto'; // Similar a los anteriores
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('reportes')
@UseGuards(JwtAuthGuard) // Protege los reportes con JWT
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('balance-general')
  async getBalance(@Query() query: ConsultarBalanceDto) {
    return this.reportesService.generarBalanceGeneral(
      query.id_empresa,
      query.fecha_corte,
    );
  }

  @Get('estado-resultados')
  async getResultados(@Query() query: ConsultarResultadosDto) {
    return this.reportesService.generarEstadoResultados(
      query.id_empresa,
      query.fecha_inicio,
      query.fecha_fin,
    );
  }

  @Get('libro-mayor')
  async getMayor(@Query() query: ConsultarMayorDto) {
    return this.reportesService.generarLibroMayor(
      query.id_empresa,
      query.id_cuenta,
      query.fecha_inicio,
      query.fecha_fin,
    );
  }
}
