import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateCentroCostoDto, UpdateCentroCostoDto } from './dto';
import { CentroCostoService } from './centro-costo.service';

@Controller('centrocosto') // Coincide con tu axios.create
export class CentroCostoController {
  constructor(private readonly centroCostoService: CentroCostoService) {}

  @Get()
  async getAll(@Query('id_empresa', ParseIntPipe) id_empresa: number) {
    return await this.centroCostoService.getallCentros(id_empresa);
  }

  @Post()
  async create(@Body() createDto: CreateCentroCostoDto) {
    return await this.centroCostoService.postCentroCosto(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCentroCostoDto,
  ) {
    return await this.centroCostoService.putCentroCosto(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.centroCostoService.deleteCentroCosto(id);
    return { message: 'Centro de costo eliminado' };
  }
}
