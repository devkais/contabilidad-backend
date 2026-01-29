import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateGestionDto {
  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsString()
  @IsNotEmpty()
  nombre: string; // Ej: "Gestión 2024"

  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_fin: string;

  @IsString()
  @IsOptional()
  @IsIn(['abierto', 'cerrado'])
  estado?: string;
}

export class UpdateGestionDto extends PartialType(CreateGestionDto) {}
