import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { CuentaAuxiliarService } from './cuenta-auxiliar.service';
import {
  CreateCuentaAuxiliarDto,
  UpdateCuentaAuxiliarDto,
} from './dto/cuenta-auxiliar.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EmpresaGestionGuard } from '../../auth/guards/empresa-gestion.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { UserRequest } from '../../auth/interfaces/auth.interface';

@Controller('cuentas-auxiliares')
@UseGuards(JwtAuthGuard, EmpresaGestionGuard)
export class CuentaAuxiliarController {
  constructor(private readonly auxiliarService: CuentaAuxiliarService) {}

  @Get('suggest-code')
  async suggestCode(
    @Query('id_padre') id_padre: string,
    @GetUser() user: UserRequest,
  ) {
    const padreId = id_padre && id_padre !== 'null' ? parseInt(id_padre) : null;
    return await this.auxiliarService.suggestNextCode(
      user.id_empresa,
      user.id_gestion,
      padreId,
    );
  }

  @Get()
  async findAll(@GetUser() user: UserRequest) {
    return await this.auxiliarService.findAllByContext(
      user.id_empresa,
      user.id_gestion,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserRequest,
  ) {
    return await this.auxiliarService.findOne(id, user.id_empresa);
  }

  @Post()
  async create(
    @Body() dto: CreateCuentaAuxiliarDto,
    @GetUser() user: UserRequest,
  ) {
    dto.id_empresa = user.id_empresa;
    dto.id_gestion = user.id_gestion;
    return await this.auxiliarService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCuentaAuxiliarDto,
    @GetUser() user: UserRequest,
  ) {
    return await this.auxiliarService.update(id, user.id_empresa, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserRequest,
  ) {
    return await this.auxiliarService.remove(id, user.id_empresa);
  }
}
