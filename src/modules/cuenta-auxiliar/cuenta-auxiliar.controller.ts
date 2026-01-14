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
import { CuentaAuxiliarService } from './cuenta-auxiliar.service';
import { CreateCuentaAuxiliarDto, UpdateCuentaAuxiliarDto } from './dto';

@Controller('cuentas_auxiliares')
export class CuentaAuxiliarController {
  constructor(private readonly cuentaAuxiliarService: CuentaAuxiliarService) {}

  @Get()
  async getAllCuentaAuxiliar() {
    return this.cuentaAuxiliarService.getAllCuentaAuxiliar();
  }

  @Get(':id_cuenta_auxiliar')
  async getCuentaAuxiliarById(
    @Param('id_cuenta_auxiliar') id_cuenta_auxiliar: number,
  ) {
    const cuentaAuxiliar =
      await this.cuentaAuxiliarService.getCuentaAuxiliarById(
        id_cuenta_auxiliar,
      );
    if (!cuentaAuxiliar)
      throw new NotFoundException('CuentaAuxiliar no encontrada.');
    return cuentaAuxiliar;
  }
  @Post()
  async postCuenteAxuliar(
    @Body() createCuentaAuxiliarDto: CreateCuentaAuxiliarDto,
  ) {
    try {
      return await this.cuentaAuxiliarService.postCuentaAuxiliar(
        createCuentaAuxiliarDto,
      );
    } catch (error) {
      let errorMessage = 'Error al crear la CuentaAuxiliar.';
      if (error instanceof Error) {
        errorMessage += ' ' + error.message;
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }
  @Put(':id_cuenta_auxiliar')
  async putCuentaAuxiliar(
    @Param('id_cuenta_auxiliar') id_cuenta_auxiliar: number,
    @Body() updateCuentaAuxiliarDto: UpdateCuentaAuxiliarDto,
  ) {
    const cuentaAuxiliar = await this.cuentaAuxiliarService.putCuentaAuxiliar(
      id_cuenta_auxiliar,
      updateCuentaAuxiliarDto,
    );
    if (!cuentaAuxiliar) {
      throw new NotFoundException('CuentaAuxiliar no encontrada.');
    }
    return cuentaAuxiliar;
  }

  @Delete(':id_cuenta_auxiliar')
  async deleteCuentaAuxiliar(
    @Param('id_cuenta_auxiliar') id_cuenta_auxiliar: number,
  ) {
    const result =
      await this.cuentaAuxiliarService.deleteCuentaAuxiliar(id_cuenta_auxiliar);
    if (!result) {
      throw new NotFoundException('CuentaAuxiliar no encontrada.');
    }
  }
}
