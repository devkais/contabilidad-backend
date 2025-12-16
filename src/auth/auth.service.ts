import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../modules/usuario/services/usuario.service';

@Injectable()
export class AuthService {
  constructor(private readonly usuarioService: UsuarioService) {}

  async login(email: string, password: string) {
    const usuario = await this.usuarioService.findByEmailWithPassword(email);

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const passwordOk = await bcrypt.compare(password, usuario.password);

    if (!passwordOk) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // ⚠️ SIN JWT REAL (solo prueba de conexión)
    return {
      message: 'Login correcto',
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
      },
      token: 'token-de-prueba', // ← SOLO PARA CONFIRMAR CONEXIÓN
    };
  }
}
