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
import { BitacoraService } from './bitacora.service';
import { CreateBitacoraDto, UpdateBitacoraDto } from './dto';

@Controller('bitacora')
export class BitacoraController {
  constructor(private readonly bitacoraService: BitacoraService) {}

  @Get()
  async getAllBitacora() {
    return this.bitacoraService.getallBitacora();
  }
  @Get(':id_bitacora')
  async getBitacoraById(@Param('id_bitacora') id_bitacora: number) {
    const bitacora = await this.bitacoraService.getBitacoraById(id_bitacora);
    if (!bitacora) {
      throw new NotFoundException('Bitacora no encontrada.');
    }
    return bitacora;
  }

  @Post()
  async postBitacora(@Body() createBitacoraDto: CreateBitacoraDto) {
    try {
      return await this.bitacoraService.postBitacora(createBitacoraDto);
    } catch (error) {
      // Manejo seguro del error
      let errorMessage = 'Error al crear el bitacora.';
      if (error instanceof Error) {
        errorMessage += ' ' + error.message;
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }
  @Put(':id_bitacora')
  async putBitacora(
    @Param('id_bitacora') id_bitacora: number,
    @Body() updateBitacoraDto: UpdateBitacoraDto,
  ) {
    const bitacora = await this.bitacoraService.putBitacora(
      id_bitacora,
      updateBitacoraDto,
    );
    if (!bitacora) {
      throw new NotFoundException('Bitacora no encontrada.');
    }
    return bitacora;
  }

  @Delete(':id_bitacora')
  async deleteBitacora(@Param('id_bitacora') id_bitacora: number) {
    const result = await this.bitacoraService.deleteBitacora(id_bitacora);
    if (!result) throw new NotFoundException('Bitacora no encontrada.');
  }
}
