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
import { EmpresaService } from '../services/empresa.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from '../dto';

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get()
  async getAllEmpresas() {
    return this.empresaService.getallEmpresas();
  }
  @Get(':id_empresa')
  async getEmpresaById(@Param('id_empresa') id_empresa: number) {
    const empresa = await this.empresaService.getEmpresaById(id_empresa);
    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada.');
    }
    return empresa;
  }

  @Post()
  async postEmpresa(@Body() createEmpresaDto: CreateEmpresaDto) {
    try {
      const empresa = await this.empresaService.postEmpresa(createEmpresaDto);
      return empresa;
    } catch (ex) {
      throw new InternalServerErrorException(ex.message);
    }
  }
  @Put(':id_empresa')
  async putEmpresa(
    @Param('id_empresa') id_empresa: number,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
  ) {
    const empresa = await this.empresaService.putEmpresa(
      id_empresa,
      updateEmpresaDto,
    );
    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada.');
    }
    return empresa;
  }

  @Delete(':id_empresa')
  async deleteEmpresa(@Param('id_empresa') id_empresa: number) {
    const result = await this.empresaService.deleteEmpresa(id_empresa);
    if (!result) throw new NotFoundException('Empresa no encontrada.');
  }
}
