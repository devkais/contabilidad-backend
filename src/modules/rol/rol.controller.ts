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
import { RolService } from './rol.service';
import { CreateRolDto, UpdateRolDto } from './dto';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  async getAllRol() {
    return this.rolService.getallRol();
  }
  @Get(':id_rol')
  async getRolById(@Param('id_rol') id_rol: number) {
    const rol = await this.rolService.getRolById(id_rol);
    if (!rol) {
      throw new NotFoundException('Rol no encontrada.');
    }
    return rol;
  }

  @Post()
  async postRol(@Body() createRolDto: CreateRolDto) {
    try {
      return await this.rolService.postRol(createRolDto);
    } catch (error) {
      // Manejo seguro del error
      let errorMessage = 'Error al crear el rol.';
      if (error instanceof Error) {
        errorMessage += ' ' + error.message;
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }
  @Put(':id_rol')
  async putRol(
    @Param('id_rol') id_rol: number,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    const rol = await this.rolService.putRol(id_rol, updateRolDto);
    if (!rol) {
      throw new NotFoundException('Rol no encontrada.');
    }
    return rol;
  }

  @Delete(':id_rol')
  async deleteRol(@Param('id_rol') id_rol: number) {
    const result = await this.rolService.deleteRol(id_rol);
    if (!result) throw new NotFoundException('Rola no encontrada.');
  }
}
