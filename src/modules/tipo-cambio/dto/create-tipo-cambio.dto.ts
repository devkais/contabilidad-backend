import {
  IsDateString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateTipoCambioDto {
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsNumber()
  @IsNotEmpty()
  id_moneda_destino: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  oficial: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  venta?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  compra?: number;
}

export class UpdateTipoCambioDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  oficial?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  venta?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  compra?: number;
}
