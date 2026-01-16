import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  MaxLength,
  IsIn,
} from 'class-validator';

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
  @IsIn(['Activo', 'Pasivo', 'Patrimonio', 'Ingreso', 'Gasto'])
  clase_cuenta?: string;

  @IsBoolean()
  es_movimiento: boolean;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;
}

export class UpdateCuentaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nombre?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsString()
  clase_cuenta?: string;
}
