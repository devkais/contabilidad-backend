import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../modules/usuario/usuario.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsuarioEmpresaModule } from '../modules/usuario-empresa/usuario-empresa.module';

@Module({
  imports: [
    UsuarioModule, // Necesario para acceder al UsuarioService
    UsuarioEmpresaModule, // Necesario para acceder al UsuarioEmpresaService
    PassportModule,
    JwtModule.register({
      secret: 'TU_LLAVE_SECRETA_SUPER_SEGURA', // En el futuro irá en el .env
      signOptions: { expiresIn: '24h' }, // La sesión dura 24 horas laboralmente
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
