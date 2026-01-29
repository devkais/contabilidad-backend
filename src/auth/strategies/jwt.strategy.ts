import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, UserRequest } from '../interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'TU_LLAVE_SECRETA_SUPER_SEGURA', // Mover a .env después
    });
  }

  validate(payload: JwtPayload): UserRequest {
    return {
      id_usuario: payload.sub,
      username: payload.username,
      id_empresa: payload.id_empresa,
      id_gestion: payload.id_gestion,
    };
  }
}
