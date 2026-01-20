import {
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class UpdateCuentaAuxiliarDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  nombre?: string;

  @IsOptional()
  @IsNumber()
  id_padre?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  nivel?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
