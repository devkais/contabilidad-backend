import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreateAsientoDto {
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  numero_comprobante: string;

  @IsString()
  @IsNotEmpty()
  glosa_general: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Ingreso', 'Egreso', 'Traspaso', 'Ajuste'])
  tipo_asiento: string;

  @IsNumber()
  @IsNotEmpty()
  id_gestion: number;

  @IsNumber()
  @IsNotEmpty()
  tc_oficial_asiento: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  sistema_origen?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  external_id?: string;

  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;
}

export class UpdateAsientoDto {
  @IsOptional()
  @IsString()
  glosa_general?: string;

  @IsOptional()
  @IsString()
  @IsIn(['contabilizado', 'borrador', 'anulado'])
  estado?: string;
}
