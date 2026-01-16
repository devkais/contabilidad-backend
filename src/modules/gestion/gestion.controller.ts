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
  Query, // <-- Capturamos la empresa actual
} from '@nestjs/common';
import { GestionService } from './gestion.service';
import { CreateGestionDto, UpdateGestionDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('gestion')
export class GestionController {
  constructor(private readonly gestionService: GestionService) {}

  @Get()
  async findAll(@Query('id_empresa') id_empresa?: number) {
    // Si se envía id_empresa, filtramos, si no, devolvemos según lógica del service
    return await this.gestionService.findAll(
      id_empresa ? Number(id_empresa) : undefined,
    );
  }

  @Get('empresa/:id_empresa')
  async findByEmpresa(@Param('id_empresa', ParseIntPipe) id_empresa: number) {
    return await this.gestionService.findByEmpresa(id_empresa);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number, // <-- Contexto de empresa
  ) {
    return await this.gestionService.findOne(id, id_empresa);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGestionDto) {
    // El id_empresa ya viene en el DTO de creación
    return await this.gestionService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGestionDto,
    @Query('id_empresa', ParseIntPipe) id_empresa: number, // <-- Seguridad
  ) {
    return await this.gestionService.update(id, dto, id_empresa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number, // <-- Seguridad
  ) {
    return await this.gestionService.remove(id, id_empresa);
  }
}
