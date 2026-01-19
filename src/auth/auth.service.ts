import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../modules/usuario/services/usuario.service';
import { UsuarioEmpresaService } from '../modules/usuario-empresa/usuario-empresa.service'; // Ajusta la ruta
import { LoginDto } from './dto/login.dto';
import { Usuario } from '../modules/usuario/usuario.entity';
import { JwtPayload } from './interfaces/auth.interface';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    nombre: string;
    id_empresa: number; // <--- Añadido
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly usuarioEmpresaService: UsuarioEmpresaService, // <--- Inyectado
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<Usuario> {
    const { username, password } = loginDto;
    const usuario =
      await this.usuarioService.findByUsernameWithPassword(username);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException(
        'Credenciales inválidas o usuario inactivo',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return usuario;
  }

  async login(user: Usuario): Promise<LoginResponse> {
    // Buscamos la empresa principal en la nueva tabla
    const relacion = await this.usuarioEmpresaService.findPrincipal(
      user.id_usuario,
    );

    const payload: JwtPayload = {
      username: user.username,
      sub: user.id_usuario,
      nombre: user.nombre_completo,
      id_empresa: relacion.id_empresa, // <--- Ahora el token tiene identidad
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id_usuario,
        username: user.username ?? '',
        nombre: user.nombre_completo ?? '',
        id_empresa: relacion.id_empresa, // <--- El front ya no tendrá 'undefined'
      },
    };
  }
}
