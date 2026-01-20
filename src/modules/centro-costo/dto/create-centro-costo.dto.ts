import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateCentroCostoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
