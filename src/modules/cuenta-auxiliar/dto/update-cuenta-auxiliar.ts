import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class UpdateCuentaAuxiliarDto {
  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  /* ==========================================================================
      CAMPOS PARA JERARQUÍA
     ========================================================================== */
  @IsOptional()
  @IsNumber()
  id_padre?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  nivel?: number;

  // El id_empresa normalmente no debería cambiarse en un Update,
  // pero lo dejamos como opcional por si el Front lo envía.
  @IsOptional()
  @IsNumber()
  id_empresa?: number;
}
