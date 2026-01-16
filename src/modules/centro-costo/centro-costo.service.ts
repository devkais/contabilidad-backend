import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CentroCosto } from './centro-costo.entity';
import { CreateCentroCostoDto, UpdateCentroCostoDto } from './dto';

@Injectable()
export class CentroCostoService {
  constructor(
    @InjectRepository(CentroCosto)
    private readonly ccRepository: Repository<CentroCosto>,
  ) {}

  // Listar centros filtrados por la empresa seleccionada
  async findAll(id_empresa: number): Promise<CentroCosto[]> {
    return await this.ccRepository.find({
      where: { id_empresa }, // <--- Filtro de seguridad por empresa
      relations: ['padre'],
      order: { codigo: 'ASC' },
    });
  }

  // Buscar uno validando que pertenezca a la empresa del contexto
  async findOne(id: number, id_empresa: number): Promise<CentroCosto> {
    const centro = await this.ccRepository.findOne({
      where: { id_centro_costo: id, id_empresa }, // <--- Candado de empresa
      relations: ['padre', 'subcentros'],
    });
    if (!centro)
      throw new NotFoundException(
        `Centro de costo con ID ${id} no encontrado en esta empresa`,
      );
    return centro;
  }

  async create(dto: CreateCentroCostoDto): Promise<CentroCosto> {
    // 1. Validar Código Duplicado DENTRO de la misma empresa
    const existe = await this.ccRepository.findOne({
      where: { codigo: dto.codigo, id_empresa: dto.id_empresa },
    });
    if (existe)
      throw new BadRequestException(
        `El código ${dto.codigo} ya está en uso para esta empresa.`,
      );

    // 2. Validar Padre y Niveles (Asegurando que el padre sea de la misma empresa)
    if (dto.id_padre) {
      const padre = await this.findOne(dto.id_padre, dto.id_empresa); // <--- Busca padre en el mismo contexto
      if (dto.nivel !== padre.nivel + 1) {
        throw new BadRequestException(
          `El nivel debe ser secuencial al padre (${padre.nivel + 1})`,
        );
      }
    } else if (dto.nivel !== 1) {
      throw new BadRequestException(
        'Un centro de costo raíz debe ser nivel 1.',
      );
    }

    const nuevoCentro = this.ccRepository.create(dto);
    return await this.ccRepository.save(nuevoCentro);
  }

  async update(
    id: number,
    dto: UpdateCentroCostoDto,
    id_empresa: number,
  ): Promise<CentroCosto> {
    const centro = await this.findOne(id, id_empresa);

    // Validar si el nuevo código ya existe en esta empresa
    if (dto.codigo && dto.codigo !== centro.codigo) {
      const existe = await this.ccRepository.findOne({
        where: { codigo: dto.codigo, id_empresa },
      });
      if (existe)
        throw new BadRequestException(
          'El código ya está siendo usado por otro centro.',
        );
    }

    this.ccRepository.merge(centro, dto);
    return await this.ccRepository.save(centro);
  }

  async remove(id: number, id_empresa: number): Promise<void> {
    const centro = await this.findOne(id, id_empresa);

    if (centro.subcentros && centro.subcentros.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar un centro que tiene sub-niveles vinculados.',
      );
    }
    await this.ccRepository.remove(centro);
  }
}
