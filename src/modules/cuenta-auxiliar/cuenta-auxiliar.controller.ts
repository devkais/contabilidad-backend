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
  Query, // <-- Importante para capturar ?id_empresa=X
} from '@nestjs/common';
import { CuentaAuxiliarService } from './cuenta-auxiliar.service';
import { CreateCuentaAuxiliarDto, UpdateCuentaAuxiliarDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cuenta_auxiliar')
export class CuentaAuxiliarController {
  constructor(private readonly caService: CuentaAuxiliarService) {}

  @Get()
  async findAll(@Query('id_empresa', ParseIntPipe) id_empresa: number) {
    // Pasamos el id_empresa al servicio para filtrar
    return await this.caService.findAll(id_empresa);
  }

  @Get('suggest-code')
  async suggestCode(
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
    @Query('id_padre') id_padre?: number,
  ) {
    return await this.caService.getSuggestNextCode(id_empresa, id_padre);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    // Validamos que el auxiliar pertenezca a la empresa
    return await this.caService.findOne(id, id_empresa);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCuentaAuxiliarDto) {
    // El id_empresa ya viene dentro del Body (CreateCuentaAuxiliarDto)
    return await this.caService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCuentaAuxiliarDto,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    // Pasamos el id de empresa para validar que el usuario no edite algo ajeno
    return await this.caService.update(id, dto, id_empresa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    return await this.caService.remove(id, id_empresa);
  }
}
