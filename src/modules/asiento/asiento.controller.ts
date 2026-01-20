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
  Query, // <-- Vital para el contexto dinámico
} from '@nestjs/common';

import { AsientoService } from './asiento.service';

import { CreateAsientoDto } from './dto';

import { Asiento } from './asiento.entity';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { GetUser } from '../../common/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('asiento')
export class AsientoController {
  constructor(private readonly asientoService: AsientoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateAsientoDto,

    @GetUser('id_usuario') id_usuario: number,
  ): Promise<Asiento> {
    // El servicio ahora valida que la gestion sea de la empresa enviada en el DTO

    return await this.asientoService.postAsiento(dto, id_usuario);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,

    @Body() dto: CreateAsientoDto,

    @Query('id_empresa', ParseIntPipe) id_empresa: number, // <-- Candado de seguridad
  ): Promise<Asiento> {
    return await this.asientoService.putAsiento(id, dto, id_empresa);
  }

  @Get()
  async findAll(
    @Query('id_empresa', ParseIntPipe) id_empresa: number,

    @Query('id_gestion', ParseIntPipe) id_gestion: number, // <-- Filtro de Libro Diario
  ): Promise<Asiento[]> {
    // Devuelve solo los asientos de la empresa y gestión seleccionada

    return await this.asientoService.getallAsiento(id_empresa, id_gestion);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,

    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ): Promise<Asiento> {
    return await this.asientoService.getAsientoById(id, id_empresa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,

    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ): Promise<void> {
    await this.asientoService.deleteAsiento(id, id_empresa);
  }
}
