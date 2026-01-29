import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsuarioEmpresaGestionService } from '../../modules/usuario-empresa-gestion/usuario-empresa-gestion.service';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Injectable()
export class EmpresaGestionGuard implements CanActivate {
  constructor(private readonly uegService: UsuarioEmpresaGestionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      user: UserRequest;
    }>();

    // 1. Extraer IDs de los headers (puedes adaptarlo a params si prefieres)
    const idEmpresaHeader = request.headers['x-empresa-id'];
    const idGestionHeader = request.headers['x-gestion-id'];

    if (!idEmpresaHeader || !idGestionHeader) {
      throw new BadRequestException(
        'Es necesario especificar la Empresa y Gestión en los headers (x-empresa-id, x-gestion-id)',
      );
    }

    const idEmpresa = Number(idEmpresaHeader);
    const idGestion = Number(idGestionHeader);

    if (isNaN(idEmpresa) || isNaN(idGestion)) {
      throw new BadRequestException(
        'Los IDs de Empresa y Gestión deben ser números válidos',
      );
    }

    // 2. Obtener el usuario inyectado por el JwtAuthGuard
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado en la petición');
    }

    // 3. Validar acceso en la base de datos mediante el servicio
    const tieneAcceso = await this.uegService.validateAccess(
      user.id_usuario,
      idEmpresa,
      idGestion,
    );

    if (!tieneAcceso) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a esta Empresa o Gestión',
      );
    }

    // 4. Inyectar los IDs validados en el objeto request para que el Service los use
    // Esto evita que el Service tenga que volver a leer headers
    request.user.id_empresa = idEmpresa;
    request.user.id_gestion = idGestion;

    return true;
  }
}
