// src/config/env.config.ts (Simulación)

// Definiciones de Zod para las variables de entorno utilizadas en el seed
import { z } from 'zod';

const EnvSchema = z.object({
  INITIAL_ADMIN_EMAIL: z.string().email().default('superadmin@seed.com'),
  INITIAL_ADMIN_PASSWORD: z.string().min(8).default('S3cur3P@ss!'),
});

export const envConfig = EnvSchema.parse(process.env);
