export interface JwtPayload {
  username: string;
  sub: number;
  nombre: string;
  id_empresa: number; // <--- Nuevo campo
}

export interface UserRequest {
  id_usuario: number;
  username: string;
  id_empresa: number; // <--- Nuevo campo
}
