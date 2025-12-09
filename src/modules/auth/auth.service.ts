/*import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from '../usuario/usuario.entity';

// Define la estructura del payload que se guardará en el JWT
interface JwtPayload {
  sub: number; // ID del usuario
  email: string;
  empresas: {
    id_empresa: number;
    nombre_empresa: string;
    id_rol: number;
    nombre_rol: string;
  }[];
}

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}


  async validateUser(email: string, pass: string): Promise<Usuario | null> {
    // 1. Tipamos explícitamente el resultado para eliminar el error 'Unsafe call/assignment'
    const usuario: Usuario | null =
      await this.usuarioService.findOneByEmail(email);

    // 2. Verificación para eliminar el error 'Unsafe member access'
    if (!usuario || !usuario.contrasena_hash) {
      return null;
    }

    // 3. Comparamos la contraseña
    const isMatch = await bcrypt.compare(pass, usuario.contrasena_hash);

    if (isMatch) {
      return usuario;
    }
    return null;
  }

  login(usuario: Usuario) {
    if (!usuario.usuarioEmpresas || usuario.usuarioEmpresas.length === 0) {
      throw new UnauthorizedException(
        'Usuario no tiene roles asignados a ninguna empresa activa.',
      );
    }

    // Mapeamos las relaciones N:M a un formato simple para el payload
    const empresasInfo = usuario.usuarioEmpresas.map((ue) => ({
      id_empresa: ue.empresa.id_empresa,
      nombre_empresa: ue.empresa.nombre,
      id_rol: ue.rol.id_rol,
      nombre_rol: ue.rol.nombre_rol,
    }));

    const payload: JwtPayload = {
      sub: usuario.id_usuario,
      email: usuario.email,
      empresas: empresasInfo,
    };

    // El token contendrá toda la información de acceso necesaria.
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        accesos: empresasInfo, // Se envía la información completa al cliente
      },
    };
  }
}
*/
