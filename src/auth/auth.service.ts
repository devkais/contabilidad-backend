import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../modules/usuario/services/usuario.service';
import { LoginDto } from './dto/login.dto';
import { Usuario } from '../modules/usuario/usuario.entity';

// Definimos una interfaz para el retorno del login, así evitamos el 'any'
export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    nombre: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida las credenciales del usuario.
   * Retorna el objeto usuario sin el password si es válido.
   */
  async validateUser(loginDto: LoginDto): Promise<Usuario> {
    const { username, password } = loginDto;

    const usuario =
      await this.usuarioService.findByUsernameWithPassword(username);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    console.log('Password plano:', password);
    console.log('Password en DB (hash):', usuario.password);

    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Retornamos el usuario. El decorador @Exclude en la entidad
    // se encargará de que el password no viaje al cliente.
    return usuario;
  }

  /**
   * Genera el JWT una vez validado el usuario.
   */
  login(user: Usuario): LoginResponse {
    // Quitamos el async y el Promise
    const payload = {
      username: user.username,
      sub: user.id_usuario,
      nombre: user.nombre_completo,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id_usuario,
        username: user.username ?? '',
        nombre: user.nombre_completo ?? '',
      },
    };
  }
}
