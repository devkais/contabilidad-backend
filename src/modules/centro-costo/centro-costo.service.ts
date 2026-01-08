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
  async getallCentroCosto(id_empresa?: number): Promise<CentroCosto[]> {
    if (id_empresa) {
      return this.centrocostoRepository.find({
        where: { empresa: { id_empresa: id_empresa } },
        order: { codigo: 'ASC' },
      });
    }
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
    // 1. Verificar si el Centro de Costo existe
    const centroExistente = await this.getCentroCostoById(id_centro_costo);
    if (!centroExistente) {
      throw new NotFoundException(
        `Centro de costo con ID ${id_centro_costo} no encontrado.`,
      );
    }

    // 2. Si el DTO trae un id_empresa, validamos que esa empresa exista
    if (updateCentroCostoDto.id_empresa) {
      const empresaExistente = await this.empresaService.getEmpresaById(
        updateCentroCostoDto.id_empresa,
      );
      if (!empresaExistente) {
        throw new NotFoundException(
          `Empresa con ID ${updateCentroCostoDto.id_empresa} no encontrada.`,
        );
      }
    }

    // 3. Limpieza de datos: Extraemos id_centro_costo para evitar que TypeORM
    // intente sobrescribir la Primary Key, y separamos id_empresa.
    const {
      id_centro_costo: _,
      id_empresa,
      ...datosParaActualizar
    } = updateCentroCostoDto;

    // 4. Ejecutar la actualización
    // Si id_empresa viene en el DTO, lo asignamos a través del objeto de relación
    const updatePayload = {
      ...datosParaActualizar,
      ...(id_empresa && { empresa: { id_empresa } }),
    };

    await this.centrocostoRepository.update(id_centro_costo, updatePayload);

    // 5. Retornar la entidad fresca desde la base de datos
    return await this.getCentroCostoById(id_centro_costo);
  }
  async deleteCentroCosto(id_centro_costo: number): Promise<boolean> {
    const result = await this.centrocostoRepository.delete({ id_centro_costo });
    // Si result.affected es null o undefined, lo tratamos como 0.
    return (result.affected ?? 0) > 0;
  }
}
