import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload, UserRequest } from '../interfaces/auth.interface';

// Forzamos a que el linter reconozca Strategy como un constructor válido
const JwtStrategyBase = PassportStrategy(Strategy as any);

@Injectable()
export class JwtStrategy extends JwtStrategyBase {
  constructor() {
    super({
      jwtFromRequest: (req: Request): string | null => {
        const authHeader = req.headers?.authorization;
        if (
          authHeader &&
          typeof authHeader === 'string' &&
          authHeader.startsWith('Bearer ')
        ) {
          return authHeader.substring(7);
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: 'TU_LLAVE_SECRETA_SUPER_SEGURA',
    });
  }

  validate(payload: JwtPayload): UserRequest {
    return {
      id_usuario: payload.sub,
      username: payload.username,
    };
  }
}
