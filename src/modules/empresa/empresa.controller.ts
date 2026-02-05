import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('empresas')
@UseGuards(JwtAuthGuard) // Seguridad de Auth aplicada a todo el controlador
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  async create(
    @Body() createEmpresaDto: CreateEmpresaDto,
    @GetUser() user: UserRequest,
  ) {
    return await this.empresaService.create(createEmpresaDto, user.id_usuario);
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

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
    @GetUser() user: UserRequest,
  ) {
    return await this.empresaService.update(
      id,
      updateEmpresaDto,
      user.id_usuario,
    );
  }
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserRequest,
  ) {
    return await this.empresaService.delete(id, user.id_usuario);
  }
}
