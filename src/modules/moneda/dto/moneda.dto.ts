import { IsString, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateMonedaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string; // Ej: BOB

  @IsString()
  @IsNotEmpty()
  nombre: string; // Ej: Bolivianos

  @IsString()
  @IsNotEmpty()
  simbolo: string; // Ej: Bs.
}

export class UpdateMonedaDto extends PartialType(CreateMonedaDto) {}
