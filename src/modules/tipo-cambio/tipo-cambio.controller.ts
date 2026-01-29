import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TipoCambioService } from './tipo-cambio.service';
import { CreateTipoCambioDto } from './dto/tipo-cambio.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('tipo-cambio')
@UseGuards(JwtAuthGuard)
export class TipoCambioController {
  constructor(private readonly tcService: TipoCambioService) {}

  @Post()
  async create(@Body() dto: CreateTipoCambioDto) {
    return await this.tcService.create(dto);
  }

  @Get('vigente')
  async getVigente(
    @Query('id_moneda', ParseIntPipe) idMoneda: number,
    @Query('fecha') fecha: string,
  ) {
    // Endpoint clave para que el Front cargue el TC al abrir el formulario de Asiento
    return await this.tcService.getVigente(idMoneda, fecha);
  }

  @Get()
  async findAll() {
    return await this.tcService.findAll();
  }
}
