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
import { AsientoService } from './asiento.service';
import { CreateAsientoDto, UpdateAsientoDto } from './dto';
import { Asiento } from './asiento.entity';

@Controller('asientos') // Ruta base: /api/v1/asientos
export class AsientoController {
  constructor(private readonly asientoService: AsientoService) {}

  // --- 1. CREACIÓN (POST) ---
  // POST /asientos
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAsientoDto: CreateAsientoDto): Promise<Asiento> {
    // El servicio se encarga de la validación de las 4 FKs antes de guardar.
    return this.asientoService.postAsiento(createAsientoDto);
  }

  // --- 2. ACTUALIZACIÓN (PUT) ---
  // PUT /asientos/:id
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id_asiento: number,
    @Body() updateAsientoDto: UpdateAsientoDto,
  ): Promise<Asiento> {
    // Llamar al servicio para actualizar el asiento
    const updatedAsiento = await this.asientoService.putAsiento(
      id_asiento,
      updateAsientoDto,
    );

    if (!updatedAsiento) {
      throw new NotFoundException(
        `Asiento con ID ${id_asiento} no encontrado.`,
      );
    }

    return updatedAsiento;
  }

  // --- 3. OBTENER TODOS LOS ASIENTOS (GET ALL) ---
  // GET /asientos
  @Get()
  async findAll(): Promise<Asiento[]> {
    return this.asientoService.getallAsiento();
  }

  // --- 4. OBTENER ASIENTO POR ID (GET BY ID) ---
  // GET /asientos/:id
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id_asiento: number,
  ): Promise<Asiento> {
    const asiento = await this.asientoService.getAsientoById(id_asiento);

    if (!asiento) {
      throw new NotFoundException(
        `Asiento con ID ${id_asiento} no encontrado.`,
      );
    }
    return asiento;
  }

  // --- 5. ELIMINAR ASIENTO (DELETE) ---
  // DELETE /asientos/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content si es exitoso
  async delete(@Param('id', ParseIntPipe) id_asiento: number): Promise<void> {
    const wasDeleted = await this.asientoService.deleteAsiento(id_asiento);

    if (!wasDeleted) {
      throw new NotFoundException(
        `Asiento con ID ${id_asiento} no encontrado o no pudo ser eliminado (posiblemente referenciado en Detalle Asiento).`,
      );
    }
  }
}
