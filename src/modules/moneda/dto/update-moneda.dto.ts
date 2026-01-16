import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMonedaDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5)
  simbolo?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  codigo?: string;
}
