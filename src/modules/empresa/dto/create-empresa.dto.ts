import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateEmpresaDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @IsString({ message: 'El NIT debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El NIT es requerido' })
  @MinLength(1, { message: 'El NIT es requerido' })
  @MaxLength(90, { message: 'El NIT no puede exceder 90 caracteres' })
  nit: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La dirección es requerida' })
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres' })
  direccion: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @MinLength(5, { message: 'El teléfono debe tener al menos 5 caracteres' })
  @MaxLength(50, { message: 'El teléfono no puede exceder 50 caracteres' })
  telefono: string;

  @IsNotEmpty({ message: 'El estado activo es requerido' })
  activo: boolean;
}
