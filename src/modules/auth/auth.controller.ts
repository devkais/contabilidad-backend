// src/modules/auth/auth.controller.ts
/*
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Usuario } from '../usuario/usuario.entity'; // Asegúrate de importar Usuario

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  // Usamos el tipo Usuario para asegurar que req.user tiene el tipo correcto.
  login(@Request() req: { user: Usuario }) {
    // El tipo ya está asegurado en la declaración del parámetro 'req'.
    const usuario: Usuario = req.user;

    return this.authService.login(usuario);
  }
}
*/
