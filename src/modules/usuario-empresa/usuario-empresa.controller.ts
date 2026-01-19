import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsuarioEmpresaService } from './usuario-empresa.service';
import { CreateUsuarioEmpresaDto } from './dto/create-usuario-empresa.dto';
import { UpdateUsuarioEmpresaDto } from './dto/update-usuario-empresa.dto';

@Controller('usuario-empresa')
export class UsuarioEmpresaController {
  constructor(private readonly ueService: UsuarioEmpresaService) {}

  @Post()
  create(@Body() createDto: CreateUsuarioEmpresaDto) {
    return this.ueService.create(createDto);
  }

  @Get('usuario/:id')
  findByUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.ueService.findByUsuario(id);
  }

  @Get('principal/:usuarioId')
  findPrincipal(@Param('usuarioId', ParseIntPipe) id: number) {
    return this.ueService.findPrincipal(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUsuarioEmpresaDto,
  ) {
    return this.ueService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ueService.remove(id);
  }
}
