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
import { AsientoService } from './asiento.service';
import { CreateAsientoDto, UpdateAsientoDto } from './dto';
import { Asiento } from './asiento.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('asientos')
export class AsientoController {
  constructor(private readonly asientoService: AsientoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateAsientoDto,
    @GetUser('id_usuario') id_usuario: number, // Obtenemos el ID directamente y tipado
  ): Promise<Asiento> {
    return await this.asientoService.postAsiento(dto, id_usuario);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAsientoDto,
  ): Promise<Asiento> {
    return await this.asientoService.putAsiento(id, dto);
  }

  @Get()
  async findAll(): Promise<Asiento[]> {
    return await this.asientoService.getallAsiento();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Asiento> {
    return await this.asientoService.getAsientoById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.asientoService.deleteAsiento(id);
  }
}
