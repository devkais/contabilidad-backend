// src/cuenta-auxiliar/dto/create-cuenta-auxiliar.dto.ts
import { IsString, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateCuentaAuxiliarDto {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  id_empresa: number;

  @IsBoolean()
  activo: boolean;
}
