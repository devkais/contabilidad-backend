import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GestionService } from './gestion.service';
import { CreateGestionDto, UpdateGestionDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('gestion')
export class GestionController {
  constructor(private readonly gestionService: GestionService) {}

  @Get()
  async findAll() {
    return await this.gestionService.findAll();
  }

  @Get('empresa/:id_empresa')
  async findByEmpresa(@Param('id_empresa', ParseIntPipe) id_empresa: number) {
    return await this.gestionService.findByEmpresa(id_empresa);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.gestionService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGestionDto) {
    return await this.gestionService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGestionDto,
  ) {
    return await this.gestionService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.gestionService.remove(id);
  }
}
