import { IsOptional, IsDateString } from 'class-validator';

export class DateRangeDto {
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha fin debe ser una fecha válida' })
  fecha_fin?: string;
}
