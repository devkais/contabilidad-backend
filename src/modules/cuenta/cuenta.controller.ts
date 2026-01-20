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
  Query, // <-- Fundamental para el contexto de empresa
} from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { CreateCuentaDto, UpdateCuentaDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cuenta')
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) {}

  @Get()
  async findAll(@Query('id_empresa', ParseIntPipe) id_empresa: number) {
    // Solo trae el plan de cuentas de la empresa seleccionada
    return await this.cuentaService.findAll(id_empresa);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    // Valida que la cuenta exista y pertenezca a la empresa
    return await this.cuentaService.findOne(id, id_empresa);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCuentaDto) {
    // El id_empresa debe venir dentro del JSON del body
    return await this.cuentaService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCuentaDto, // <--- Debe ser el de cuentas
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    return await this.cuentaService.update(id, dto, id_empresa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    return await this.cuentaService.remove(id, id_empresa);
  }
}
