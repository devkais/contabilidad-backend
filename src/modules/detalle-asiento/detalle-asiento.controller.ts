import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query, // <-- Necesario para capturar ?id_empresa=X
} from '@nestjs/common';
import { DetalleAsientoService } from './detalle-asiento.service';
import { CreateDetalleAsientoDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('detalle-asiento')
export class DetalleAsientoController {
  constructor(private readonly detalleService: DetalleAsientoService) {}

  @Post()
  async create(@Body() dto: CreateDetalleAsientoDto) {
    // El id_empresa ya viene en el body para validar la cuenta en el service
    return await this.detalleService.postDetalle(dto);
  }

  @Get('asiento/:id')
  async findByAsiento(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number, // <-- Candado de seguridad
  ) {
    return await this.detalleService.getByAsiento(id, id_empresa);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateDetalleAsientoDto,
    @Query('id_empresa', ParseIntPipe) id_empresa: number, // <-- Candado de seguridad
  ) {
    return await this.detalleService.putDetalle(id, dto, id_empresa);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number, // <-- Candado de seguridad
  ) {
    return await this.detalleService.deleteDetalle(id, id_empresa);
  }
}
