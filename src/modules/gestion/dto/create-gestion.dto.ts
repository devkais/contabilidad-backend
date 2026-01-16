import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreateGestionDto {
  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_fin: string;

  @IsOptional()
  @IsString()
  @IsIn(['abierto', 'cerrado'])
  estado?: string;
}

export class UpdateGestionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @IsIn(['abierto', 'cerrado'])
  estado?: string;
}
