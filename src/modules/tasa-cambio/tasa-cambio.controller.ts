import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { TasaCambioService } from './tasa-cambio.service';
import { BulkCreateTasaCambioDto } from './dto/create-tasa-cambio.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasa-cambio')
export class TasaCambioController {
  constructor(private readonly tasaCambioService: TasaCambioService) {}

  @Post('bulk')
  async createBulk(@Body() dto: BulkCreateTasaCambioDto) {
    return await this.tasaCambioService.bulkCreate(dto);
  }

  @Get('fecha/:fecha')
  async findByFecha(@Param('fecha') fecha: string) {
    return this.tasaCambioService.getTasaByFecha(fecha);
  }
}
