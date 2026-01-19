import {
  Body,
  Controller,
  Get,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from '../services/usuario.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Usuario } from '../usuario.entity';

//@UseGuards(JwtAuthGuard) // Protegemos el módulo
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  async getAllUsuarios(): Promise<Usuario[]> {
    return await this.usuarioService.getAllUsuarios();
  }

  @Get(':id_usuario')
  async getUsuarioById(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
  ): Promise<Usuario> {
    return await this.usuarioService.getUsuarioById(id_usuario);
  }

  @Post()
  async postUsuario(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<Usuario> {
    try {
      return await this.usuarioService.postUsuario(createUsuarioDto);
    } catch (error: unknown) {
      let errorMessage = 'Error al crear el usuario.';
      if (error instanceof Error) {
        errorMessage += ' ' + error.message;
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Put(':id_usuario')
  async putUsuario(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    return await this.usuarioService.putUsuario(id_usuario, updateUsuarioDto);
  }

  @Delete(':id_usuario')
  async deleteUsuario(
    @Param('id_usuario', ParseIntPipe) id_usuario: number,
  ): Promise<{ message: string }> {
    await this.usuarioService.deleteUsuario(id_usuario);
    return { message: 'Usuario desactivado con éxito.' };
  }
}
