import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUsuarioEmpresaDto {
  @IsNumber()
  @IsNotEmpty()
  id_usuario: number;
  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;
  @IsNumber()
  @IsNotEmpty()
  id_rol: number;
}
