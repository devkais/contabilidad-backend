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
import { CentroCostoService } from './centro-costo.service';
import {
  CreateCentroCostoDto,
  UpdateCentroCostoDto,
} from './dto/centro-costo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmpresaGestionGuard } from '../../auth/guards/empresa-gestion.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('centro-costos')
@UseGuards(JwtAuthGuard, EmpresaGestionGuard) // Doble capa de seguridad
export class CentroCostoController {
  constructor(private readonly ccService: CentroCostoService) {}

  @Post()
  async create(
    @Body() dto: CreateCentroCostoDto,
    @GetUser() user: UserRequest,
  ) {
    // Forzamos los IDs del contexto validado para evitar inyecciones
    dto.id_empresa = user.id_empresa;
    dto.id_gestion = user.id_gestion;
    return await this.ccService.create(dto);
  }

  @Get()
  async findAll(@GetUser() user: UserRequest) {
    // Solo listamos lo que pertenece a la empresa y gestión activa en los headers
    return await this.ccService.findAllByContext(
      user.id_empresa,
      user.id_gestion,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserRequest,
  ) {
    return await this.ccService.findOne(id, user.id_empresa);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCentroCostoDto,
    @GetUser() user: UserRequest,
  ) {
    return await this.ccService.update(id, user.id_empresa, dto);
  }
}
