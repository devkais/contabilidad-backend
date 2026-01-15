import { IsOptional, IsDateString } from 'class-validator';

export class DateRangeDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de inicio debe ser una fecha válida (ISO 8601)' },
  )
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha fin debe ser una fecha válida (ISO 8601)' },
  )
  fecha_fin?: string;
}
