import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsIn,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCuentaDto {
  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsNumber()
  @IsNotEmpty()
  id_gestion: number;

  @IsNumber()
  @IsNotEmpty()
  id_moneda: number;

  @IsString()
  @IsNotEmpty()
  codigo: string; // Ej: 1.1.1.01.001

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  nivel: number;

  @IsOptional()
  @IsNumber()
  id_cuenta_padre?: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO', 'COSTO']) // <-- Cámbialo a MAYÚSCULAS
  clase_cuenta: string;

  @IsBoolean()
  es_movimiento: boolean; // true = nivel 5 (imputable)

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class UpdateCuentaDto extends PartialType(CreateCuentaDto) {}
