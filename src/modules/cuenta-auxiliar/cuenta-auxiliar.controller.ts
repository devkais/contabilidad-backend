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
import { CuentaAuxiliarService } from './cuenta-auxiliar.service';
import { CreateCuentaAuxiliarDto, UpdateCuentaAuxiliarDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cuenta-auxiliar')
export class CuentaAuxiliarController {
  constructor(private readonly caService: CuentaAuxiliarService) {}

  @Get()
  async findAll() {
    return await this.caService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.caService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCuentaAuxiliarDto) {
    return await this.caService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCuentaAuxiliarDto,
  ) {
    return await this.caService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.caService.remove(id);
  }
}
