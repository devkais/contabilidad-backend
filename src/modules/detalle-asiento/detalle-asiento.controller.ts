import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { DetalleAsientoService } from './detalle-asiento.service';
import { CreateDetalleAsientoDto, UpdateDetalleAsientoDto } from './dto';
import { DetalleAsiento } from './detalle-asiento.entity';

@Controller('detalle-asientos') // Ruta base: /api/v1/detalle-asientos
export class DetalleAsientoController {
  constructor(private readonly detalleAsientoService: DetalleAsientoService) {}

  // --- 1. CREACIÓN (POST) ---
  // POST /detalle-asientos
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateDetalleAsientoDto,
  ): Promise<DetalleAsiento> {
    // El servicio valida las 4 FKs (Asiento, Cuenta, Auxiliar, Centro Costo).
    return this.detalleAsientoService.postDetalleAsiento(createDto);
  }

  // --- 2. ACTUALIZACIÓN (PUT) ---
  // PUT /detalle-asientos/:id
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id_detalle: number,
    @Body() updateDto: UpdateDetalleAsientoDto,
  ): Promise<DetalleAsiento> {
    const updatedDetalle = await this.detalleAsientoService.putDetalleAsiento(
      id_detalle,
      updateDto,
    );

    if (!updatedDetalle) {
      throw new NotFoundException(
        `Línea de detalle con ID ${id_detalle} no encontrada.`,
      );
    }

    return updatedDetalle;
  }

  // --- 3. OBTENER DETALLES POR ID DE ASIENTO ---
  // GET /detalle-asientos/by-asiento/:id_asiento
  // Este es el endpoint más útil en la práctica.
  @Get('by-asiento/:id_asiento')
  async findByAsientoId(
    @Param('id_asiento', ParseIntPipe) id_asiento: number,
  ): Promise<DetalleAsiento[]> {
    return this.detalleAsientoService.getDetallesByAsientoId(id_asiento);
  }

  // --- 4. OBTENER TODAS LAS LÍNEAS DE DETALLE (GET ALL) ---
  // GET /detalle-asientos
  @Get()
  async findAll(): Promise<DetalleAsiento[]> {
    return this.detalleAsientoService.getallDetalleAsiento();
  }

  // --- 5. OBTENER LÍNEA DE DETALLE POR ID (GET BY ID) ---
  // GET /detalle-asientos/:id
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id_detalle: number,
  ): Promise<DetalleAsiento> {
    const detalle =
      await this.detalleAsientoService.getDetalleAsientoById(id_detalle);

    if (!detalle) {
      throw new NotFoundException(
        `Línea de detalle con ID ${id_detalle} no encontrada.`,
      );
    }
    return detalle;
  }

  // --- 6. ELIMINAR LÍNEA DE DETALLE (DELETE) ---
  // DELETE /detalle-asientos/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content si es exitoso
  async delete(@Param('id', ParseIntPipe) id_detalle: number): Promise<void> {
    const wasDeleted =
      await this.detalleAsientoService.deleteDetalleAsiento(id_detalle);

    if (!wasDeleted) {
      throw new NotFoundException(
        `Línea de detalle con ID ${id_detalle} no encontrada.`,
      );
    }
  }
}
