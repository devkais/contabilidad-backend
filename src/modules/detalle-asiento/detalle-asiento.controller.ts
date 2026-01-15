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
} from '@nestjs/common';
import { DetalleAsientoService } from './detalle-asiento.service';
import { CreateDetalleAsientoDto, UpdateDetalleAsientoDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('detalle-asiento')
export class DetalleAsientoController {
  constructor(private readonly detalleService: DetalleAsientoService) {}

  @Post()
  async create(@Body() dto: CreateDetalleAsientoDto) {
    return await this.detalleService.postDetalle(dto);
  }

  @Get('asiento/:id')
  async findByAsiento(@Param('id', ParseIntPipe) id: number) {
    return await this.detalleService.getByAsiento(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDetalleAsientoDto,
  ) {
    return await this.detalleService.putDetalle(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.detalleService.deleteDetalle(id);
  }
}
