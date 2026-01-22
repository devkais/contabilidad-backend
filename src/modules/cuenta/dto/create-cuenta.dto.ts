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
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  nivel: number;

  @IsOptional()
  @IsNumber()
  id_padre?: number; // Cambiado para coincidir con la entidad

  @IsNumber()
  id_moneda: number;

  @IsString()
  @IsIn(['Activo', 'Pasivo', 'Patrimonio', 'Ingreso', 'Gasto', 'Costo'])
  tipo_cuenta: string; // Cambiado de clase_cuenta a tipo_cuenta

  @IsBoolean()
  es_movimiento: boolean;

  @IsNumber()
  id_empresa: number;

  @IsNumber()
  @IsOptional()
  id_gestion: number;
}

export class UpdateCuentaDto extends PartialType(CreateCuentaDto) {}
