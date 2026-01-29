import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CuentaAuxiliarService } from './cuenta-auxiliar.service';
import { CreateCuentaAuxiliarDto } from './dto/cuenta-auxiliar.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmpresaGestionGuard } from '../../auth/guards/empresa-gestion.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('cuentas-auxiliares')
@UseGuards(JwtAuthGuard, EmpresaGestionGuard)
export class CuentaAuxiliarController {
  constructor(private readonly auxiliarService: CuentaAuxiliarService) {}

  @Post()
  async create(
    @Body() dto: CreateCuentaAuxiliarDto,
    @GetUser() user: UserRequest,
  ) {
    // Blindamos los IDs de empresa y gestión desde el token/guard
    dto.id_empresa = user.id_empresa;
    dto.id_gestion = user.id_gestion;
    return await this.auxiliarService.create(dto);
  }

  @Get()
  async findAll(@GetUser() user: UserRequest) {
    return await this.auxiliarService.findAllByContext(
      user.id_empresa,
      user.id_gestion,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserRequest,
  ) {
    return await this.auxiliarService.findOne(id, user.id_empresa);
  }
}
