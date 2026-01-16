import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRequest } from '../interfaces/auth.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * handleRequest se ejecuta después de que la estrategia JWT ha terminado.
   * @param err Error capturado por Passport
   * @param user El objeto devuelto por el método validate() de la estrategia
   * @param info Información adicional (ej. errores de expiración)
   */
  override handleRequest<TUser = UserRequest>(
    err: Error | null,
    user: TUser | false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext,
  ): TUser {
    // Si hay un error o Passport no devolvió un usuario (token inválido)
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Acceso denegado: Token inválido o inexistente',
        )
      );
    }

    // Si todo está bien, devolvemos el usuario que se inyectará en req.user
    return user;
  }
}
