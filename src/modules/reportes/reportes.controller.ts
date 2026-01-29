/*import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ConsultarResultadosDto } from './dto/consultar-resultados.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('reportes')
@UseGuards(JwtAuthGuard) // Protege los reportes con JWT
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('balance-general')
  async getBalance(
    @Query('id_empresa') id_empresa: number,
    @Query('fecha_corte') fecha_corte: string,
  ) {
    // Esto llamará a la lógica recursiva que ya corregimos
    return await this.reportesService.generarBalanceGeneral(
      id_empresa,
      fecha_corte,
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
  async getLibroMayor(
    @Query('id_empresa') id_empresa: number,
    @Query('id_cuenta') id_cuenta: number,
    @Query('fecha_inicio') fecha_inicio: string,
    @Query('fecha_fin') fecha_fin: string,
  ) {
    return await this.reportesService.generarLibroMayor(
      Number(id_empresa),
      Number(id_cuenta),
      fecha_inicio,
      fecha_fin,
    );
  }
}
*/
