import { IsInt, IsISO8601, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ConsultarBalanceDto {
  @IsInt()
  @Type(() => Number) // Transforma el string de la URL a número
  id_empresa: number;

  @IsISO8601()
  @IsOptional()
  fecha_corte?: string; // Ejemplo: "2026-12-31"
}
