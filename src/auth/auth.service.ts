import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../modules/usuario/usuario.service';
import { UsuarioEmpresaGestionService } from '../modules/usuario-empresa-gestion/usuario-empresa-gestion.service';
import { LoginDto } from './dto/login.dto';
import { Usuario } from '../modules/usuario/usuario.entity';
import { JwtPayload } from './interfaces/auth.interface';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    nombre: string;
    id_empresa: number;
    id_gestion: number;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly uegService: UsuarioEmpresaGestionService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<Usuario> {
    const { username, password } = loginDto;

    // Ahora buscamos específicamente por el campo username
    const usuario =
      await this.usuarioService.findByUsernameWithPassword(username);

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      usuario.contrasenaHash,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales inválidas');

    return usuario;
  }

  async login(user: Usuario): Promise<LoginResponse> {
    const contexto = await this.uegService.findPrincipalContext(
      user.id_usuario,
    );
    if (!contexto)
      throw new UnauthorizedException('Usuario sin empresa asignada');

    const payload: JwtPayload = {
      username: user.username, // Usamos el nuevo campo
      sub: user.id_usuario,
      nombre: user.nombre,
      id_empresa: contexto.id_empresa,
      id_gestion: contexto.id_gestion,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id_usuario,
        username: user.username,
        nombre: user.nombre,
        id_empresa: contexto.id_empresa,
        id_gestion: contexto.id_gestion,
      },
    };
  }
}
