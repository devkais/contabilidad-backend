import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { CreateCuentaDto } from './dto/cuenta.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmpresaGestionGuard } from '../../auth/guards/empresa-gestion.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('cuentas')
@UseGuards(JwtAuthGuard, EmpresaGestionGuard)
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) {}

  @Post()
  async create(@Body() dto: CreateCuentaDto, @GetUser() user: UserRequest) {
    // Forzamos contexto desde el Guard de seguridad
    dto.id_empresa = user.id_empresa;
    dto.id_gestion = user.id_gestion;
    return await this.cuentaService.create(dto);
  }

  @Get()
  async findAll(@GetUser() user: UserRequest) {
    // Solo el plan de cuentas de la empresa/gestión actual
    return await this.cuentaService.findAllByContext(
      user.id_empresa,
      user.id_gestion,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserRequest,
  ) {
    // Validamos que la cuenta pertenezca a su empresa
    const cuenta = await this.cuentaService.findMovimientoOnly(
      id,
      user.id_empresa,
    );
    return cuenta;
  }
}
