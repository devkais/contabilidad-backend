import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCentroCostoDto {
  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsNumber()
  @IsNotEmpty()
  id_gestion: number;

  @IsString()
  @IsNotEmpty()
  codigo: string; // Ej: "ADM-001", "VTAS-LPZ"

  @IsString()
  @IsNotEmpty()
  nombre: string; // Ej: "Administración Central"

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class UpdateCentroCostoDto extends PartialType(CreateCentroCostoDto) {}
