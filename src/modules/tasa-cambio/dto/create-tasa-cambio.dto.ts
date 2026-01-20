// src/modules/tasa-cambio/dto/create-tasa-cambio.dto.ts
import {
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TasaCambioItemDto {
  @IsDateString()
  fecha: string;

  @IsNumber()
  cotizacion_usd: number;

  @IsNumber()
  cotizacion_ufv: number;
}

export class BulkCreateTasaCambioDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TasaCambioItemDto)
  tasas: TasaCambioItemDto[];
}
