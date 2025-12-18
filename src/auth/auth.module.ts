import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioModule } from '../modules/usuario/usuario.module';
import { UsuarioEmpresaModule } from '../modules/usuario-empresa/usuario-empresa.module';

@Module({
  imports: [
    UsuarioModule, // ⬅️ NECESARIO para usar UsuarioService
    UsuarioEmpresaModule, // ⬅️ NECESARIO para usar UsuarioEmpresaService
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
