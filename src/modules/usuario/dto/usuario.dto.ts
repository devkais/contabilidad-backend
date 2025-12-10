export class UsuarioDto {
  id_usuario: number;
  nombre: string;
  email: string;
  contraseña_hash: string;
  activo: boolean;
}
