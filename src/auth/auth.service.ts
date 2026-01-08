/*import contabilidadApi from '@/api/contabilidadApi';
import { Usuario } from '@/features/usuarios/interfaces/usuario.interface';

interface LoginResponse {
  user: Usuario;
  token: string;
  id_empresa: number; // Según el back, necesitamos el contexto
  id_gestion: number;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const { data } = await contabilidadApi.post<LoginResponse>('/auth/login', {
      username,
      password,
    });
    return data;
  },
};*/
