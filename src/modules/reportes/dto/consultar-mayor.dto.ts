import { IsInt, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class ConsultarMayorDto {
  @IsInt()
  @Type(() => Number)
  id_empresa: number;

  @IsInt()
  @Type(() => Number)
  id_cuenta: number; // ID de la cuenta específica a mayorizar

  @IsISO8601()
  fecha_inicio: string;

  @IsISO8601()
  fecha_fin: string;
}
