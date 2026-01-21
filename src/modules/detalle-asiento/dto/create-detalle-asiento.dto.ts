import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDetalleAsientoDto {
  @IsNumber()
  @IsOptional()
  id_asiento?: number;

  @IsNumber()
  id_cuenta: number;

  @IsNumber()
  id_empresa: number;

  @IsOptional()
  @IsNumber()
  id_centro_costo?: number | null;

  @IsOptional()
  @IsNumber()
  id_cuenta_auxiliar?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  glosa_detalle?: string;

  @IsNumber()
  @Min(0)
  debe_bs: number;

  @IsNumber()
  @Min(0)
  haber_bs: number;

  @IsNumber()
  @Min(0)
  debe_sus: number;

  @IsNumber()
  @Min(0)
  haber_sus: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  codigo_flujo?: string;
}

export class UpdateDetalleAsientoDto extends CreateDetalleAsientoDto {}
