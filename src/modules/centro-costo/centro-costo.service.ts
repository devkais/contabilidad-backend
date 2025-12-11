import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CentroCosto } from './centro-costo.entity';
import { Repository } from 'typeorm';
import { CreateCentroCostoDto, UpdateCentroCostoDto } from './dto';
import { EmpresaService } from '../empresa/services/empresa.service'; // Asegúrate de la ruta

@Injectable()
export class CentroCostoService {
  constructor(
    @InjectRepository(CentroCosto)
    private readonly centrocostoRepository: Repository<CentroCosto>,
    private readonly empresaService: EmpresaService,
  ) {}

  // El servicio debe devolver la entidad, no el DTO directamente.
  async getallCentroCosto(): Promise<CentroCosto[]> {
    return this.centrocostoRepository.find();
  }

  async getCentroCostoById(
    id_centro_costo: number,
  ): Promise<CentroCosto | null> {
    const centrocosto = await this.centrocostoRepository.findOne({
      where: { id_centro_costo },
    });
    return centrocosto;
  }
  async postCentroCosto(
    createCentroCostoDto: CreateCentroCostoDto,
  ): Promise<CentroCosto> {
    // Desestructurar el ID para buscar la entidad
    const { id_empresa, ...rest } = createCentroCostoDto;

    // 1. Obtener la entidad Empresa completa
    const empresa = await this.empresaService.getEmpresaById(id_empresa);

    if (!empresa) {
      throw new NotFoundException(
        `Empresa con ID ${id_empresa} no encontrada.`,
      );
    }

    // 2. Crear el objeto de CentroCosto, asignando la entidad Empresa
    const centroCostoToCreate = this.centrocostoRepository.create({
      ...rest,
      empresa: empresa, // Asignar la entidad completa a la propiedad de relación
    });

    const centrocosto =
      await this.centrocostoRepository.save(centroCostoToCreate);
    return centrocosto;
  }
  async putCentroCosto(
    id_centro_costo: number,
    updateCentroCostoDto: UpdateCentroCostoDto,
  ): Promise<CentroCosto | null> {
    // Retornamos la entidad CentroCosto

    // Opción 1: Pasar el DTO de actualización directamente a TypeORM
    // TypeORM intentará mapear los campos, incluyendo 'id_empresa' si existe
    // en la entidad con @Column.

    // 1. Opcionalmente, verificar que la empresa existe si el ID está en el DTO
    if (updateCentroCostoDto.id_empresa) {
      const empresaExistente = await this.empresaService.getEmpresaById(
        updateCentroCostoDto.id_empresa,
      );
      if (!empresaExistente) {
        throw new NotFoundException(
          `Empresa con ID ${updateCentroCostoDto.id_empresa} no encontrada para la actualización.`,
        );
      }
    }

    // 2. Ejecutar la actualización directamente con el DTO (o sus campos)
    const result = await this.centrocostoRepository.update(
      { id_centro_costo },
      // NO usamos .create() para el update. Pasamos el DTO de datos planos.
      updateCentroCostoDto,
    );

    if (!result.affected) {
      return null;
    }

    // 3. Retornar el registro actualizado
    // Cambié el retorno a CentroCosto (entidad) por consistencia
    return await this.getCentroCostoById(id_centro_costo);
  }
  async deleteCentroCosto(id_centro_costo: number): Promise<boolean> {
    const result = await this.centrocostoRepository.delete({ id_centro_costo });
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
}
