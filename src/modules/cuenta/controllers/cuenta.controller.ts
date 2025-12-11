// src/modules/cuentas/controllers/cuenta.controller.ts
import {
  Body,
  Controller,
  Get,
  Delete,
  NotFoundException,
  Param,
  Post,
  Put,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CuentaService } from '../services/cuenta.service';
import { CreateCuentaDto, UpdateCuentaDto } from '../dto';

@Controller('cuenta')
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) {}

  // ----------------------------------------------------
  // LECTURA
  // ----------------------------------------------------
  @Get('empresa/:id_empresa')
  async getAllCuentas(@Param('id_empresa') id_empresa: number) {
    return this.cuentaService.getAllCuentas(id_empresa);
  }

  @Get('tree/empresa/:id_empresa')
  async getCuentasAsTree(@Param('id_empresa') id_empresa: number) {
    return this.cuentaService.getCuentasAsTree(id_empresa);
  }

  @Get(':id_cuenta')
  async getCuentaById(@Param('id_cuenta') id_cuenta: number) {
    const cuenta = await this.cuentaService.getCuentaById(id_cuenta);
    if (!cuenta) throw new NotFoundException('Cuenta no encontrada.');
    return cuenta;
  }

  // ----------------------------------------------------
  // ESCRITURA
  // ----------------------------------------------------

  @Post()
  async postCuenta(@Body() createDto: CreateCuentaDto) {
    try {
      return await this.cuentaService.postCuenta(createDto);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e; // Lanza excepciones de validación de negocio
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':id_cuenta')
  async putCuenta(
    @Param('id_cuenta') id_cuenta: number,
    @Body() updateDto: UpdateCuentaDto,
  ) {
    const cuenta = await this.cuentaService.putCuenta(id_cuenta, updateDto);
    if (!cuenta) throw new NotFoundException('Cuenta no encontrada.');
    return cuenta;
  }

  @Delete(':id_cuenta')
  async deleteCuenta(@Param('id_cuenta') id_cuenta: number) {
    try {
      const result = await this.cuentaService.deleteCuenta(id_cuenta);
      if (!result) throw new NotFoundException('Cuenta no encontrada.');
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e; // Lanza error si tiene cuentas hijas
      }
      throw new InternalServerErrorException(e.message);
    }
  }
}
