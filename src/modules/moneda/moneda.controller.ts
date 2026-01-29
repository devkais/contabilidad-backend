import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MonedaService } from './moneda.service';
import { CreateMonedaDto, UpdateMonedaDto } from './dto/moneda.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('monedas')
@UseGuards(JwtAuthGuard) // Solo usuarios logueados pueden gestionar monedas
export class MonedaController {
  constructor(private readonly monedaService: MonedaService) {}

  @Post()
  async create(@Body() createMonedaDto: CreateMonedaDto) {
    return await this.monedaService.create(createMonedaDto);
  }

  @Get()
  async findAll() {
    return await this.monedaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.monedaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMonedaDto: UpdateMonedaDto,
  ) {
    return await this.monedaService.update(id, updateMonedaDto);
  }
}
