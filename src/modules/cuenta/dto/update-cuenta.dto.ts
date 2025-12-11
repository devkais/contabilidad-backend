// src/modules/cuentas/dto/update-cuenta.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCuentaDto } from './create-cuenta.dto';

export class UpdateCuentaDto extends PartialType(CreateCuentaDto) {
  // Aquí todos los campos de CreateCuentaDto son opcionales
}
