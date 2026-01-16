import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BitacoraService } from './bitacora.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Bitacora } from './bitacora.entity';

@UseGuards(JwtAuthGuard)
@Controller('bitacora')
export class BitacoraController {
  constructor(private readonly bitacoraService: BitacoraService) {}

  @Get()
  async findAll(): Promise<Bitacora[]> {
    return await this.bitacoraService.findAll();
  }

  @Get('empresa/:id')
  async findByEmpresa(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Bitacora[]> {
    return await this.bitacoraService.findByEmpresa(id);
  }
}
