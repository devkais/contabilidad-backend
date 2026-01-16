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
  HttpCode,
  HttpStatus,
  Query, // <-- Capturamos el contexto de empresa
} from '@nestjs/common';
import { CentroCostoService } from './centro-costo.service';
import { CreateCentroCostoDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('centro-costo')
export class CentroCostoController {
  constructor(private readonly ccService: CentroCostoService) {}

  @Get()
  async findAll(@Query('id_empresa', ParseIntPipe) id_empresa: number) {
    // Solo obtenemos los centros de costo de la empresa activa
    return await this.ccService.findAll(id_empresa);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    // Validamos ID y Empresa para evitar fugas de datos
    return await this.ccService.findOne(id, id_empresa);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCentroCostoDto) {
    // id_empresa viaja dentro del objeto 'dto' enviado desde el frontend
    return await this.ccService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCentroCostoDto,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    // Aseguramos que la actualización ocurra dentro del contexto correcto
    return await this.ccService.update(id, dto, id_empresa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    // Eliminación protegida por ID de empresa
    return await this.ccService.remove(id, id_empresa);
  }
}
