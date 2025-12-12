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
import { CuentaService } from './cuenta.service';
import { CreateCuentaDto, UpdateCuentaDto } from './dto';
import { Cuenta } from './cuenta.entity';

@Controller('cuentas') // Ruta base: /api/v1/cuentas
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) {}

  // --- 1. CREACIÓN (POST) ---
  // POST /cuentas
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCuentaDto: CreateCuentaDto): Promise<Cuenta> {
    // El servicio se encarga de la validación de las 4 FKs antes de guardar.
    return this.cuentaService.postCuenta(createCuentaDto);
  }

  // --- 2. ACTUALIZACIÓN (PUT) ---
  // PUT /cuentas/:id
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id_cuenta: number,
    @Body() updateCuentaDto: UpdateCuentaDto,
  ): Promise<Cuenta> {
    // Llamar al servicio para actualizar la cuenta
    const updatedCuenta = await this.cuentaService.putCuenta(
      id_cuenta,
      updateCuentaDto,
    );

    if (!updatedCuenta) {
      throw new NotFoundException(`Cuenta con ID ${id_cuenta} no encontrada.`);
    }

    return updatedCuenta;
  }

  // --- 3. OBTENER TODAS LAS CUENTAS (GET ALL) ---
  // GET /cuentas
  @Get()
  async findAll(): Promise<Cuenta[]> {
    return this.cuentaService.getallCuenta();
  }

  // --- 4. OBTENER CUENTA POR ID (GET BY ID) ---
  // GET /cuentas/:id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id_cuenta: number): Promise<Cuenta> {
    const cuenta = await this.cuentaService.getCuentaById(id_cuenta);

    if (!cuenta) {
      throw new NotFoundException(`Cuenta con ID ${id_cuenta} no encontrada.`);
    }
    return cuenta;
  }

  // --- 5. ELIMINAR CUENTA (DELETE) ---
  // DELETE /cuentas/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content si es exitoso
  async delete(@Param('id', ParseIntPipe) id_cuenta: number): Promise<void> {
    const wasDeleted = await this.cuentaService.deleteCuenta(id_cuenta);

    if (!wasDeleted) {
      // Si la cuenta no se encontró, o si la base de datos impidió la eliminación (FK restrict)
      // Aunque en el servicio ya se intenta eliminar, lanzamos 404 si el registro no existía.
      // Si la eliminación falla por FK, NestJS lanzará una excepción 500 que puedes manejar con filtros.
      throw new NotFoundException(
        `Cuenta con ID ${id_cuenta} no encontrada o no pudo ser eliminada (posiblemente referenciada).`,
      );
    }
  }
}
