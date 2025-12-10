// src/modules/usuario/controllers/usuario.controller.ts
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
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto';

@Controller('usuario') // Nota: Usar plural 'usuarios' es convención REST
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  async getAllUsuarios() {
    return this.usuarioService.getAllUsuarios();
  }

  @Get(':id_usuario')
  async getUsuarioById(@Param('id_usuario') id_usuario: number) {
    const usuario = await this.usuarioService.getUsuarioById(id_usuario);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return usuario;
  }

  @Post()
  async postUsuario(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      return await this.usuarioService.postUsuario(createUsuarioDto);
    } catch (error) {
      // Manejo seguro del error
      let errorMessage = 'Error al crear el usuario.';
      if (error instanceof Error) {
        errorMessage += ' ' + error.message;
      }

      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Put(':id_usuario')
  async putUsuario(
    @Param('id_usuario') id_usuario: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuario = await this.usuarioService.putUsuario(
      id_usuario,
      updateUsuarioDto,
    );
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return usuario;
  }

  @Delete(':id_usuario')
  async deleteUsuario(@Param('id_usuario') id_usuario: number) {
    const result = await this.usuarioService.deleteUsuario(id_usuario);
    if (!result) throw new NotFoundException('Usuario no encontrado.');
    return { message: 'Usuario eliminado con éxito.' };
  }
}
