import { IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateUsuarioEmpresaDto {
  @IsInt()
  id_usuario: number;

  @IsInt()
  id_empresa: number;

  @IsOptional()
  @IsBoolean()
  es_principal?: boolean;
}
