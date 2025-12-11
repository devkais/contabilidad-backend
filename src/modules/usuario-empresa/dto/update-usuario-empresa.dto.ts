import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUsuarioEmpresaDto {
  @IsNumber()
  @IsOptional()
  id_rol?: number;
}
