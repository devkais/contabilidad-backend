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
import { CentroCostoService } from './centro-costo.service';
import { CreateCentroCostoDto, UpdateCentroCostoDto } from './dto';

@Controller('centrocosto')
export class CentroCostoController {
  constructor(private readonly centrocostoService: CentroCostoService) {}

  @Get()
  async getAllCentroCosto() {
    return this.centrocostoService.getallCentroCosto();
  }
  @Get(':id_centro_costo')
  async getCentroCostoById(@Param('id_centro_costo') id_centro_costo: number) {
    const centrocosto =
      await this.centrocostoService.getCentroCostoById(id_centro_costo);
    if (!centrocosto) {
      throw new NotFoundException('CentroCosto no encontrada.');
    }
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
    @Param('id_centro_costo') id_centro_costo: number,
    @Body() updateCentroCostoDto: UpdateCentroCostoDto,
  ) {
    const centrocosto = await this.centrocostoService.putCentroCosto(
      id_centro_costo,
      updateCentroCostoDto,
    );
    if (!centrocosto) {
      throw new NotFoundException('CentroCosto no encontrada.');
    }
    return centrocosto;
  }

  @Delete(':id_centro_costo')
  async deleteCentroCosto(@Param('id_centro_costo') id_centro_costo: number) {
    const result =
      await this.centrocostoService.deleteCentroCosto(id_centro_costo);
    if (!result) throw new NotFoundException('CentroCostoa no encontrada.');
  }
}
