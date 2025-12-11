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
import { MonedaService } from './moneda.service';
import { CreateMonedaDto, UpdateMonedaDto } from './dto';

@Controller('moneda')
export class MonedaController {
  constructor(private readonly monedaService: MonedaService) {}

  @Get()
  async getAllMoneda() {
    return this.monedaService.getallMoneda();
  }
  @Get(':id_moneda')
  async getMonedaById(@Param('id_moneda') id_moneda: number) {
    const moneda = await this.monedaService.getMonedaById(id_moneda);
    if (!moneda) {
      throw new NotFoundException('Moneda no encontrada.');
    }
    return moneda;
  }

  @Post()
  async postMoneda(@Body() createMonedaDto: CreateMonedaDto) {
    try {
      return await this.monedaService.postMoneda(createMonedaDto);
    } catch (error) {
      // Manejo seguro del error
      let errorMessage = 'Error al crear el moneda.';
      if (error instanceof Error) {
        errorMessage += ' ' + error.message;
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }
  @Put(':id_moneda')
  async putMoneda(
    @Param('id_moneda') id_moneda: number,
    @Body() updateMonedaDto: UpdateMonedaDto,
  ) {
    const moneda = await this.monedaService.putMoneda(
      id_moneda,
      updateMonedaDto,
    );
    if (!moneda) {
      throw new NotFoundException('Moneda no encontrada.');
    }
    return moneda;
  }

  @Delete(':id_moneda')
  async deleteMoneda(@Param('id_moneda') id_moneda: number) {
    const result = await this.monedaService.deleteMoneda(id_moneda);
    if (!result) throw new NotFoundException('Monedaa no encontrada.');
  }
}
