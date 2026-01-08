// backend/src/cuentas/dto/create-cuenta.dto.ts
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class CreateCuentaDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  nivel: number;

  @IsOptional() // Muy importante para que acepte null
  @IsNumber()
  id_cuenta_padre: number | null;

  @IsNumber()
  id_empresa: number;

  @IsNumber()
  id_gestion: number;

  @IsNumber()
  id_moneda: number;

  @IsString() // O IsEnum(ClaseCuenta) si tienes el enum en el back
  clase_cuenta: string;

  @IsBoolean()
  activo: boolean;

  @IsBoolean()
  es_movimiento: boolean;
}
