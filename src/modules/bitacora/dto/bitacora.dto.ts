import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
  IsIP,
} from 'class-validator';

export class CreateBitacoraDto {
  @IsNumber()
  @IsNotEmpty()
  id_usuario: number;

  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsString()
  @IsNotEmpty()
  accion: string; // Ej: "CREAR_ASIENTO", "ELIMINAR_CUENTA"

  @IsString()
  @IsNotEmpty()
  modulo_origen: string; // Ej: "CONTABILIDAD"

  @IsString()
  @IsNotEmpty()
  tabla_afectada: string; // Ej: "asiento"

  @IsNumber()
  @IsNotEmpty()
  id_registro_afectado: number;

  @IsIP()
  @IsOptional()
  ip_maquina?: string;

  @IsObject()
  @IsOptional()
  detalle_cambio?: Record<string, any>; // El "Antes" y "Después" en JSON
}
