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
  Query, // <-- Capturamos el contexto de empresa
} from '@nestjs/common';
import { CentroCostoService } from './centro-costo.service';
import { CreateCentroCostoDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateCentroCostoDto } from './dto/update-centro-costo.dto';

@Controller('centro-costo')
@UseGuards(JwtAuthGuard)
@Controller('centro-costo') // <-- Verifica que el frontend use esta ruta
export class CentroCostoController {
  constructor(private readonly ccService: CentroCostoService) {}

  @Get()
  findAll(@Query('id_empresa', ParseIntPipe) id_empresa: number) {
    return this.ccService.findAll(id_empresa);
  }

  @Post()
  create(@Body() dto: CreateCentroCostoDto) {
    return this.ccService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCentroCostoDto,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    return this.ccService.update(id, dto, id_empresa);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    return this.ccService.remove(id, id_empresa);
  }
}
