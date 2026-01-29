import { IsNumber, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateUsuarioEmpresaGestionDto {
  @IsNumber()
  @IsNotEmpty()
  id_usuario: number;

  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsNumber()
  @IsNotEmpty()
  id_gestion: number;

  @IsBoolean()
  @IsOptional()
  es_principal?: boolean;
}

// Nota: No suele haber Update para esta tabla,
// generalmente se borra el permiso y se crea uno nuevo,
// o se actualiza solo el campo 'es_principal'.
