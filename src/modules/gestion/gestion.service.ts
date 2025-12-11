import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gestion } from './gestion.entity';
import { Repository } from 'typeorm';
import { CreateGestionDto, UpdateGestionDto } from './dto';
import { EmpresaService } from '../empresa/services/empresa.service';

@Injectable()
export class GestionService {
  constructor(
    @InjectRepository(Gestion)
    private readonly gestionRepository: Repository<Gestion>,
    private readonly empresaService: EmpresaService,
  ) {}

  // El servicio debe devolver la entidad, no el DTO directamente.
  async getallGestion(): Promise<Gestion[]> {
    return this.gestionRepository.find();
  }

  async getGestionById(id_gestion: number): Promise<Gestion | null> {
    const gestion = await this.gestionRepository.findOne({
      where: { id_gestion },
    });
    return gestion;
  }
  async postGestion(createGestionDto: CreateGestionDto): Promise<Gestion> {
    // Cambiamos el retorno a la entidad Gestion

    // Desestructurar el ID de la FK y el resto de los datos
    const { id_empresa, ...rest } = createGestionDto;

    // 1. Obtener la entidad Empresa completa
    const empresa = await this.empresaService.getEmpresaById(id_empresa);

    if (!empresa) {
      throw new NotFoundException(
        `Empresa con ID ${id_empresa} no encontrada.`,
      );
    }

    // 2. Crear el objeto de Gestion, asignando la entidad Empresa
    const gestionToCreate = this.gestionRepository.create({
      ...rest, // Incluye nombre, fecha_inicio, fecha_fin, estado
      empresa: empresa, // Asignar la entidad completa a la propiedad de relación
    });

    // 3. Guardar el nuevo registro
    const gestion = await this.gestionRepository.save(gestionToCreate);
    return gestion;
  }
  async putGestion(
    id_gestion: number,
    updateGestionDto: UpdateGestionDto,
  ): Promise<Gestion | null> {
    // Cambiamos el retorno a la entidad Gestion

    // 1. Opcional: Verificar que la empresa existe si el ID está en el DTO
    if (updateGestionDto.id_empresa) {
      const empresaExistente = await this.empresaService.getEmpresaById(
        updateGestionDto.id_empresa,
      );
      if (!empresaExistente) {
        throw new NotFoundException(
          `Empresa con ID ${updateGestionDto.id_empresa} no encontrada para la actualización.`,
        );
      }
    }

    // 2. Ejecutar la actualización con el DTO (estrategia sencilla)
    const result = await this.gestionRepository.update(
      { id_gestion },
      updateGestionDto, // Pasamos el DTO de datos planos, sin usar .create()
    );

    if (!result.affected) {
      return null;
    }

    return await this.getGestionById(id_gestion);
  }
  async deleteGestion(id_gestion: number): Promise<boolean> {
    const result = await this.gestionRepository.delete({ id_gestion });
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
}
