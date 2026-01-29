export interface JwtPayload {
  sub: number; // id_usuario
  username: string;
  nombre: string;
  id_empresa: number;
  id_gestion: number; // <--- Agregado para el túnel de contexto
}

export interface UserRequest {
  id_usuario: number;
  username: string;
  id_empresa: number;
  id_gestion: number;
}
