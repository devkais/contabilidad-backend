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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CentroCostoService } from './centro-costo.service';
import { CreateCentroCostoDto, UpdateCentroCostoDto } from './dto';

@Controller('centrocosto')
export class CentroCostoController {
  constructor(private readonly centrocostoService: CentroCostoService) {}

  @Get()
  async getAllCentroCosto(@Query('id_empresa') id_empresa?: string) {
    // Convertimos a número si existe el query param
    const empresaId = id_empresa ? parseInt(id_empresa, 10) : undefined;
    return this.centrocostoService.getallCentroCosto(empresaId);
  }
  @Get(':id_centro_costo')
  async getCentroCostoById(
    @Param('id_centro_costo', ParseIntPipe) id_centro_costo: number,
  ) {
    const centrocosto =
      await this.centrocostoService.getCentroCostoById(id_centro_costo);
    if (!centrocosto)
      throw new NotFoundException('Centro de costo no encontrado.');
    return centrocosto;
  }

  @Post()
  async postCentroCosto(@Body() createCentroCostoDto: CreateCentroCostoDto) {
    try {
      return await this.centrocostoService.postCentroCosto(
        createCentroCostoDto,
      );
    } catch (error) {
      // Manejo seguro del error
      let errorMessage = 'Error al crear el centrocosto.';
      if (error instanceof Error) {
        errorMessage += ' ' + error.message;
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }
  @Put(':id_centro_costo')
  async putCentroCosto(
    @Param('id_centro_costo', ParseIntPipe) id_centro_costo: number,
    @Body() updateCentroCostoDto: UpdateCentroCostoDto,
  ) {
    return this.centrocostoService.putCentroCosto(
      id_centro_costo,
      updateCentroCostoDto,
    );
  }

  @Delete(':id_centro_costo')
  async deleteCentroCosto(@Param('id_centro_costo') id_centro_costo: number) {
    const result =
      await this.centrocostoService.deleteCentroCosto(id_centro_costo);
    if (!result) throw new NotFoundException('CentroCostoa no encontrada.');
  }
}
