// src/utils/hash.utils.ts o simplemente ponlo en el script seed.ts por simplicidad
import * as bcrypt from 'bcrypt';

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
}
