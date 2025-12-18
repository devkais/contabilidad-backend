import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('nombre') nombre: string,
    @Body('password') password: string,
    @Body('id_empresa') id_empresa: number,
  ) {
    return this.authService.login(nombre, password, id_empresa);
  }
}
