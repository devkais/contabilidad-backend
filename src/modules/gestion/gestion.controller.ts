import {
  Body,
  Controller,
  Get,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GestionService } from './gestion.service';
import { CreateGestionDto, UpdateGestionDto } from './dto';

@Controller('gestion')
export class GestionController {
  constructor(private readonly gestionService: GestionService) {}

  @Get()
  async getAllGestion() {
    return this.gestionService.getallGestion();
  }
  @Get(':id_gestion')
  async getGestionById(@Param('id_gestion') id_gestion: number) {
    const gestion = await this.gestionService.getGestionById(id_gestion);
    if (!gestion) {
      throw new NotFoundException('Gestion no encontrada.');
    }
    return gestion;
  }

  @Post()
  async postGestion(@Body() createGestionDto: CreateGestionDto) {
    try {
      return await this.gestionService.postGestion(createGestionDto);
    } catch (error) {
      // Manejo seguro del error
      let errorMessage = 'Error al crear el gestion.';
      if (error instanceof Error) {
        errorMessage += ' ' + error.message;
      }
      throw new InternalServerErrorException(errorMessage);
    }
  }
  @Put(':id_gestion')
  async putGestion(
    @Param('id_gestion') id_gestion: number,
    @Body() updateGestionDto: UpdateGestionDto,
  ) {
    const gestion = await this.gestionService.putGestion(
      id_gestion,
      updateGestionDto,
    );
    if (!gestion) {
      throw new NotFoundException('Gestion no encontrada.');
    }
    return gestion;
  }

  @Delete(':id_gestion')
  async deleteGestion(@Param('id_gestion') id_gestion: number) {
    const result = await this.gestionService.deleteGestion(id_gestion);
    if (!result) throw new NotFoundException('Gestiona no encontrada.');
  }
}
