import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TipoCambioService } from './tipo-cambio.service';
import { CreateTipoCambioDto, UpdateTipoCambioDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tipo-cambio')
export class TipoCambioController {
  constructor(private readonly tcService: TipoCambioService) {}

  @Get()
  async findAll() {
    return await this.tcService.findAll();
  }

  @Get('buscar')
  async findByFecha(@Query('fecha') fecha: string) {
    return await this.tcService.findByFecha(fecha);
  }

  @Post()
  async create(@Body() dto: CreateTipoCambioDto) {
    return await this.tcService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTipoCambioDto,
  ) {
    return await this.tcService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.tcService.remove(id);
  }
}
