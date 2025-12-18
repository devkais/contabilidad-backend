import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../modules/usuario/services/usuario.service';
import { UsuarioEmpresaService } from '../modules/usuario-empresa/usuario-empresa.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly usuarioEmpresaService: UsuarioEmpresaService,
  ) {}

  async login(nombre: string, password: string, id_empresa: number) {
    // 🧩 PASO 1 — Autenticación del usuario por nombre
    const usuario = await this.usuarioService.findByNombreWithPassword(nombre);

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Verificar contraseña
    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    // 🧩 PASO 2 — Validación de empresa
    const relacionUsuarioEmpresa =
      await this.usuarioEmpresaService.getUsuarioEmpresaById(
        usuario.id_usuario,
        id_empresa,
      );

    if (!relacionUsuarioEmpresa) {
      throw new UnauthorizedException(
        'El usuario no tiene acceso a esta empresa',
      );
    }

    // 🧩 PASO 3 — Construcción del contexto contable
    const contextoContable = {
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
      },
      empresa: {
        id_empresa: relacionUsuarioEmpresa.empresa.id_empresa,
        nombre: relacionUsuarioEmpresa.empresa.nombre,
        nit: relacionUsuarioEmpresa.empresa.nit,
      },
      rol: {
        id_rol: relacionUsuarioEmpresa.rol.id_rol,
        nombre_rol: relacionUsuarioEmpresa.rol.nombre_rol,
      },
      token: 'token-de-prueba', // ← SOLO PARA CONFIRMAR CONEXIÓN
    };

    // 🧩 PASO 4 — Respuesta del login
    return {
      message: 'Login correcto - Contexto contable establecido',
      sesion: contextoContable,
    };
  }
}
