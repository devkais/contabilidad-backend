import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateMonedaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  simbolo: string;
}

export class UpdateMonedaDto {
  @IsString()
  @IsOptional()
  @MaxLength(10)
  codigo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  simbolo?: string;
}
