import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCuentaAuxiliarDto {
  // NO incluyas el ID aquí si lo pasas por la URL (:id)

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsNumber()
  id_empresa?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
