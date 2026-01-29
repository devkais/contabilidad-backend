import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/empresa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('empresas')
@UseGuards(JwtAuthGuard) // Seguridad de Auth aplicada a todo el controlador
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  async create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return await this.empresaService.create(createEmpresaDto);
  }

  @Get()
  async findAll(@GetUser() user: UserRequest) {
    // Filtrado automático por usuario logueado
    return await this.empresaService.findAllByUser(user.id_usuario);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserRequest,
  ) {
    return await this.empresaService.findOne(id, user.id_usuario);
  }
}
