import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { EmpresaService } from '../services/empresa.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from '../dto';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get()
  async getAll() {
    return await this.empresaService.getallEmpresas();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const empresa = await this.empresaService.getEmpresaById(id);
    if (!empresa) throw new NotFoundException('Empresa no encontrada');
    return empresa;
  }

  @Post()
  async create(@Body() createDto: CreateEmpresaDto) {
    return await this.empresaService.postEmpresa(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEmpresaDto,
  ) {
    const empresa = await this.empresaService.putEmpresa(id, updateDto);
    if (!empresa)
      throw new NotFoundException('Empresa no encontrada para actualizar');
    return empresa;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.empresaService.deleteEmpresa(id);
    if (!deleted) throw new NotFoundException('No se pudo eliminar la empresa');
    return { message: 'Empresa eliminada con éxito' };
  }
}
