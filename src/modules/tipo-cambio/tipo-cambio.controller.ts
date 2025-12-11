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
import { TipoCambioService } from './tipo-cambio.service';
import { CreateTipoCambioDto, UpdateTipoCambioDto } from './dto';

@Controller('tipocambio')
export class TipoCambioController {
  constructor(private readonly tipocambioService: TipoCambioService) {}

  @Get()
  async getAllTipoCambio() {
    return this.tipocambioService.getallTipoCambio();
  }
  @Get(':id_tipo_cambio')
  async getTipoCambioById(@Param('id_tipo_cambio') id_tipo_cambio: number) {
    const tipocambio =
      await this.tipocambioService.getTipoCambioById(id_tipo_cambio);
    if (!tipocambio) {
      throw new NotFoundException('TipoCambio no encontrada.');
    }
    return tipocambio;
  }

  @Post()
  async postTipoCambio(@Body() createTipoCambioDto: CreateTipoCambioDto) {
    try {
      return await this.tipocambioService.postTipoCambio(createTipoCambioDto);
    } catch (error) {
      // Manejo seguro del error
      let errorMessage = 'Error al crear el tipocambio.';
      if (error instanceof Error) {
        errorMessage += ' ' + error.message;
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }
  @Put(':id_tipo_cambio')
  async putTipoCambio(
    @Param('id_tipo_cambio') id_tipo_cambio: number,
    @Body() updateTipoCambioDto: UpdateTipoCambioDto,
  ) {
    const tipocambio = await this.tipocambioService.putTipoCambio(
      id_tipo_cambio,
      updateTipoCambioDto,
    );
    if (!tipocambio) {
      throw new NotFoundException('TipoCambio no encontrada.');
    }
    return tipocambio;
  }

  @Delete(':id_tipo_cambio')
  async deleteTipoCambio(@Param('id_tipo_cambio') id_tipo_cambio: number) {
    const result =
      await this.tipocambioService.deleteTipoCambio(id_tipo_cambio);
    if (!result) throw new NotFoundException('TipoCambioa no encontrada.');
  }
}
