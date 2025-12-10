import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Importamos el módulo de usuario para usar el UsuarioService
import { UsuarioModule } from '../usuario/usuario.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy'; // Se usará para rutas protegidas

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    // Corregido: La sintaxis es correcta, pero el error desaparece si el ConfigService se inyecta correctamente
    JwtModule.registerAsync({
      imports: [ConfigModule],
      // Cambiamos a síncrono, ya que configService.get es síncrono.
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy], // Dejamos pendiente JwtStrategy
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
