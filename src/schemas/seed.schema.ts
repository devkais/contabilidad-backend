// src/schemas/seed.schema.ts
import { z } from 'zod';

// Esquemas para validar los datos antes de la creación
export const RolSchema = z.object({
  id_rol: z.number().int().positive(),
  nombre_rol: z.string().max(100),
});

export const UsuarioSchema = z.object({
  id_usuario: z.number().int().positive(),
  nombre: z.string().max(100),
  email: z.string().email().max(100),
  contrasena_hash: z.string().max(255),
  activo: z.boolean().default(true),
});

export const EmpresaSchema = z.object({
  id_empresa: z.number().int().positive(),
  nombre: z.string().max(100),
  nit: z.string().max(90),
  direccion: z.string().max(255),
  telefono: z.string().max(50),
});

// Puedes definir schemas para todas las demás entidades (Moneda, Gestion, etc.)
