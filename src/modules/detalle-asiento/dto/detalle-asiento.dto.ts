import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateDetalleAsientoDto {
  @IsNumber()
  @IsNotEmpty()
  id_cuenta: number;

  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsNumber()
  @IsNotEmpty()
  id_gestion: number;

  @IsNumber()
  @IsOptional()
  id_centro_costo?: number;

  @IsNumber()
  @IsOptional()
  id_cuenta_auxiliar?: number;

  @IsString()
  @IsOptional()
  glosa_detalle?: string;

  // Montos en Bolivianos
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  debe_bs: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  haber_bs: number;

  // Montos en Dólares (opcionales si el sistema los calcula)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  debe_sus?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  haber_sus?: number;

  @IsNumber({ maxDecimalPlaces: 8 })
  @IsOptional()
  monto_ufv?: number;

  @IsString()
  @IsOptional()
  codigo_flujo?: string;
}
