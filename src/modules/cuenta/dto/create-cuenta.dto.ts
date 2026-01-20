import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  MaxLength,
  IsIn,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCuentaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsNumber()
  nivel: number;

  @IsOptional()
  @IsNumber()
  id_cuenta_padre?: number;

  @IsNumber()
  id_moneda: number;

  @IsString()
  @IsOptional()
  @IsIn(['ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO'])
  clase_cuenta?: string;

  @IsBoolean()
  es_movimiento: boolean;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsNumber()
  @IsOptional()
  id_gestion: number;
}

export class UpdateCuentaDto extends PartialType(CreateCuentaDto) {}
