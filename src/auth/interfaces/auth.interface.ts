export interface JwtPayload {
  username: string;
  sub: number; // El ID del usuario
  nombre: string;
}

export interface UserRequest {
  id_usuario: number;
  username: string;
}
