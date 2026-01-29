import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCuentaAuxiliarDto {
  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsNumber()
  @IsNotEmpty()
  id_gestion: number;

  @IsNumber()
  @IsOptional()
  id_padre?: number; // Referencia a la misma tabla para jerarquía

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  nivel: number; // Nivel jerárquico (1, 2, 3...)

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class UpdateCuentaAuxiliarDto extends PartialType(
  CreateCuentaAuxiliarDto,
) {}
