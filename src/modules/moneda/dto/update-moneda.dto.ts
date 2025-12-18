import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMonedaDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'El simbolo debe ser una cadena de texto' })
  @MinLength(1, { message: 'El simbolo debe tener al menos 1 caracter' })
  @MaxLength(10, { message: 'El simbolo no puede exceder 10 caracteres' })
  simbolo?: string;

  @IsOptional()
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MinLength(1, { message: 'El NIT es requerido' })
  @MaxLength(90, { message: 'El NIT no puede exceder 90 caracteres' })
  codigo?: string;
}
