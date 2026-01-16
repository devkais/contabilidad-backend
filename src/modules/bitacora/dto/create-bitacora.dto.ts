import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsObject,
  MaxLength,
} from 'class-validator';

export class CreateBitacoraDto {
  @IsInt()
  @IsNotEmpty()
  id_empresa: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  accion: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  modulo_origen: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tabla_afectada: string;

  @IsInt()
  @IsNotEmpty()
  id_registro_afectado: number;

  @IsObject()
  @IsOptional()
  detalle_cambio?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  ip_maquina?: string;
}
