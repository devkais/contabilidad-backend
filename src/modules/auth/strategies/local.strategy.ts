import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Indica que el campo de usuario es 'email'
      passwordField: 'contrasena', // Indica que el campo de contraseña es 'contrasena' (como se espera en el front)
    });
  }

  // Se llama desde el AuthGuard('local')
  async validate(email: string, contrasena: string): Promise<any> {
    const usuario = await this.authService.validateUser(email, contrasena);
    if (!usuario) {
      throw new UnauthorizedException(
        'Credenciales incorrectas o usuario inactivo.',
      );
    }
    // Retorna el objeto usuario (sin el hash de la contraseña) para ser inyectado en req.user
    return usuario;
  }
}
