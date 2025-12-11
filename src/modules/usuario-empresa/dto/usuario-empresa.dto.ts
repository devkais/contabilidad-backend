import { UsuarioDto } from '../../usuario/dto/usuario.dto';
import { EmpresaDto } from '../../empresa/dto/empresa.dto';
import { RolDto } from '../../rol/dto/rol.dto';

export class UsuarioEmpresaDto {
  id_usuario: number;
  id_empresa: number;
  id_rol: number;

  // Incluir las entidades relacionadas para una respuesta completa
  usuario: UsuarioDto;
  empresa: EmpresaDto;
  rol: RolDto;
}
