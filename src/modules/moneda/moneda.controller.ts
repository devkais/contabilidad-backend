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
import { MonedaService } from './moneda.service';
import { CreateMonedaDto, UpdateMonedaDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('moneda')
export class MonedaController {
  constructor(private readonly monedaService: MonedaService) {}

  @Get()
  async findAll() {
    return await this.monedaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.monedaService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMonedaDto: CreateMonedaDto) {
    return await this.monedaService.create(createMonedaDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMonedaDto: UpdateMonedaDto,
  ) {
    return await this.monedaService.update(id, updateMonedaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.monedaService.remove(id);
  }
}
