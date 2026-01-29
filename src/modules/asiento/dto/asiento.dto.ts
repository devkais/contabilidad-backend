import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleAsientoDto } from '../../detalle-asiento/dto/detalle-asiento.dto';

export class CreateAsientoDto {
  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsNumber()
  @IsNotEmpty()
  id_gestion: number;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  numero_comprobante: string;

  @IsString()
  @IsNotEmpty()
  glosa_general: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['INGRESO', 'EGRESO', 'TRASPASO', 'AJUSTE'])
  tipo_asiento: string;

  @IsNumber({ maxDecimalPlaces: 6 })
  @IsNotEmpty()
  tc_oficial_asiento: number;

  @IsNumber({ maxDecimalPlaces: 6 })
  @IsOptional()
  tc_ufv_asiento?: number;

  // VALIDACIÓN ANIDADA
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleAsientoDto)
  detalles: CreateDetalleAsientoDto[];
}

export class UpdateAsientoDto extends PartialType(CreateAsientoDto) {}
