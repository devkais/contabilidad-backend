// src/modules/asiento/dto/create-asiento.dto.ts
import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsArray,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CreateDetalleAsientoDto } from '../../detalle-asiento/dto/create-detalle-asiento.dto';

export class CreateAsientoDto {
  @IsNotEmpty() fecha: string;
  @IsNotEmpty() numero_comprobante: string;
  @IsNotEmpty() glosa_general: string;
  @IsNotEmpty() tipo_asiento: string;
  @IsNumber() id_gestion: number;
  @IsNumber() id_empresa: number;
  @IsNumber() tc_oficial_asiento: number;

  @IsNumber()
  @IsOptional()
  created_by: number;

  @IsOptional() beneficiario?: string; // Nuevo
  @IsOptional() cheque_nro?: string; // Nuevo

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleAsientoDto)
  detalles: CreateDetalleAsientoDto[]; // Importante para creación atómica

  @IsNumber()
  @IsOptional()
  tc_ufv_asiento: number;
}
