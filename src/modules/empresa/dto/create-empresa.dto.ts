import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(90)
  nit: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  telefono?: string;
}

export class UpdateEmpresaDto {
  @IsString() @IsOptional() @MaxLength(100) nombre?: string;
  @IsString() @IsOptional() @MaxLength(90) nit?: string;
  @IsString() @IsOptional() @MaxLength(255) direccion?: string;
  @IsString() @IsOptional() @MaxLength(50) telefono?: string;
}
