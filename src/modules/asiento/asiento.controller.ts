import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AsientoService } from './asiento.service';
import { CreateAsientoDto } from './dto/asiento.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmpresaGestionGuard } from '../../auth/guards/empresa-gestion.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('asientos')
@UseGuards(JwtAuthGuard, EmpresaGestionGuard)
export class AsientoController {
  constructor(private readonly asientoService: AsientoService) {}

  @Post()
  async create(@Body() dto: CreateAsientoDto, @GetUser() user: UserRequest) {
    // El servicio se encarga de la transacción y el cuadre
    return await this.asientoService.create(dto, user);
  }

  @Get()
  async findAll(@GetUser() user: UserRequest) {
    return await this.asientoService.findAll(user.id_empresa, user.id_gestion);
  }
}
