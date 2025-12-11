import {
  Body,
  Controller,
  Get,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsuarioEmpresaService } from '../services/usuario-empresa.service';
import { CreateUsuarioEmpresaDto, UpdateUsuarioEmpresaDto } from '../dto';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return typeof error === 'string' ? error : JSON.stringify(error);
  } catch {
    // fallback seguro
    return String(error);
  }
}

@Controller('usuario-empresa')
export class UsuarioEmpresaController {
  constructor(private readonly usuarioEmpresaService: UsuarioEmpresaService) {}

  @Get()
  async getAllUsuarioEmpresa() {
    return await this.usuarioEmpresaService.findAll();
  }

  @Get(':id_usuario/:id_empresa')
  async getUsuarioEmpresaById(
    @Param('id_usuario') id_usuario: number,
    @Param('id_empresa') id_empresa: number,
  ) {
    const usuarioEmpresa = await this.usuarioEmpresaService.findOne(
      id_usuario,
      id_empresa,
    );
    if (!usuarioEmpresa) {
      throw new NotFoundException('Relación Usuario-Empresa no encontrada.');
    }
    return usuarioEmpresa;
  }

  @Post()
  async createUsuarioEmpresa(@Body() createDto: CreateUsuarioEmpresaDto) {
    try {
      return await this.usuarioEmpresaService.create(createDto);
    } catch (error: unknown) {
      // usamos la función para normalizar el mensaje (y evitar asignaciones inseguras)
      const errorMessage =
        'Error al crear la relación Usuario-Empresa. ' + getErrorMessage(error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Put(':id_usuario/:id_empresa/:id_rol')
  async updateUsuarioEmpresa(
    @Param('id_usuario') id_usuario: number,
    @Param('id_empresa') id_empresa: number,
    @Param('id_rol') id_rol: number,
    @Body() updateDto: UpdateUsuarioEmpresaDto,
  ) {
    const usuarioEmpresa = await this.usuarioEmpresaService.update(
      id_usuario,
      id_empresa,
      id_rol,
      updateDto,
    );
    if (!usuarioEmpresa) {
      throw new NotFoundException(
        'Relación Usuario-Empresa no encontrada para actualizar.',
      );
    }
    return usuarioEmpresa;
  }

  @Delete(':id_usuario/:id_empresa/:id_rol')
  async removeUsuarioEmpresa(
    @Param('id_usuario') id_usuario: number,
    @Param('id_empresa') id_empresa: number,
    @Param('id_rol') id_rol: number,
  ) {
    const result = await this.usuarioEmpresaService.remove(
      id_usuario,
      id_empresa,
      id_rol,
    );
    if (!result) {
      throw new NotFoundException(
        'Relación Usuario-Empresa no encontrada para eliminar.',
      );
    }
  }
}
