// src/modules/usuario/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

// PartialType hace que todos los campos sean opcionales (?)
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  // Nota: Si se pasa 'password', se hasheará en el servicio.
}
