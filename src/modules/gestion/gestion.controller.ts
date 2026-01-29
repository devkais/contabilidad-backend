import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GestionService } from './gestion.service';
import { CreateGestionDto } from './dto/gestion.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmpresaGestionGuard } from '../../auth/guards/empresa-gestion.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('gestiones')
@UseGuards(JwtAuthGuard) // Primero autenticamos quién es
export class GestionController {
  constructor(private readonly gestionService: GestionService) {}

  @Post()
  async create(@Body() createGestionDto: CreateGestionDto) {
    // Generalmente solo un admin crea gestiones
    return await this.gestionService.create(createGestionDto);
  }

  @Get('empresa')
  @UseGuards(EmpresaGestionGuard) // Validamos que el usuario tenga acceso a la empresa solicitada
  async findAll(@GetUser() user: UserRequest) {
    // Extraemos id_empresa del contexto validado por el Guard
    return await this.gestionService.findAllByEmpresa(user.id_empresa);
  }

  @Get(':id')
  @UseGuards(EmpresaGestionGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserRequest,
  ) {
    return await this.gestionService.findOne(id, user.id_empresa);
  }
}
