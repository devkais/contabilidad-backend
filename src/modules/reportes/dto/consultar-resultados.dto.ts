import { IsInt, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class ConsultarResultadosDto {
  @IsInt()
  @Type(() => Number)
  id_empresa: number;

  @IsISO8601()
  fecha_inicio: string;

  @IsISO8601()
  fecha_fin: string;
}
