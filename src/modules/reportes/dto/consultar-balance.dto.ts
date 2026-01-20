import { IsInt, IsISO8601, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ConsultarBalanceDto {
  @IsInt()
  @Type(() => Number)
  id_empresa: number;

  @IsISO8601()
  @IsOptional()
  fecha_corte?: string;
}
