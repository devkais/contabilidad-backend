import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsuarioEmpresaGestionService } from './usuario-empresa-gestion.service';
import { CreateUsuarioEmpresaGestionDto } from './dto/usuario-empresa-gestion.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('usuario-empresa-gestion')
@UseGuards(JwtAuthGuard)
export class UsuarioEmpresaGestionController {
  constructor(private readonly uegService: UsuarioEmpresaGestionService) {}

  @Post('asignar-acceso')
  async asignarAcceso(@Body() dto: CreateUsuarioEmpresaGestionDto) {
    // Vincula usuario con empresa/gestión (útil al crear usuarios nuevos)
    return await this.uegService.create(dto);
  }

  @Get('mis-accesos')
  async getMisAccesos(@GetUser() user: UserRequest) {
    // Retorna la lista para que el usuario elija en qué empresa trabajar
    return await this.uegService.findAllByUser(user.id_usuario);
  }

  @Post('seleccionar-principal')
  async seleccionarPrincipal(
    @GetUser() user: UserRequest,
    @Body('id_empresa') id_empresa: number,
    @Body('id_gestion') id_gestion: number,
  ) {
    // Permite al usuario cambiar su empresa/gestión activa por defecto
    return await this.uegService.changePrincipal(
      user.id_usuario,
      id_empresa,
      id_gestion,
    );
  }

  @Get('contexto-principal')
  async getPrincipal(@GetUser() user: UserRequest) {
    return await this.uegService.findPrincipalContext(user.id_usuario);
  }
}
