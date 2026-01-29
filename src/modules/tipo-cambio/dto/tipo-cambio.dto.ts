import {
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTipoCambioDto {
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsNumber()
  @IsNotEmpty()
  id_moneda_destino: number; // Generalmente el ID asociado a USD

  @IsNumber({ maxDecimalPlaces: 6 })
  @IsNotEmpty()
  oficial: number;

  @IsNumber({ maxDecimalPlaces: 6 })
  @IsOptional()
  venta?: number;

  @IsNumber({ maxDecimalPlaces: 6 })
  @IsOptional()
  compra?: number;
}

export class UpdateTipoCambioDto extends PartialType(CreateTipoCambioDto) {}
