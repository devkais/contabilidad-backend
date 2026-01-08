/*import axios from 'axios';
import { useAuthStore } from '@/features/auth/stores/auth.store';

const contabilidadApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3000/api/v1
});

// Este interceptor es clave: saca el token de tu Store y lo mete en el header
contabilidadApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default contabilidadApi;*/
