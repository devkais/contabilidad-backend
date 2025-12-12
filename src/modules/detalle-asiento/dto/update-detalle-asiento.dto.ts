// src/detalle-asiento/dto/update-detalle-asiento.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleAsientoDto } from './create-detalle-asiento.dto';

// Todos los campos de CreateDetalleAsientoDto se vuelven opcionales
export class UpdateDetalleAsientoDto extends PartialType(
  CreateDetalleAsientoDto,
) {}
