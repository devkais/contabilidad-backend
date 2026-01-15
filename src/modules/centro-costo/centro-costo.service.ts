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

  async findAll(): Promise<CentroCosto[]> {
    return await this.ccRepository.find({
      relations: ['padre'],
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CentroCosto> {
    const centro = await this.ccRepository.findOne({
      where: { id_centro_costo: id },
      relations: ['padre', 'subcentros'],
    });
    if (!centro)
      throw new NotFoundException(`Centro de costo con ID ${id} no encontrado`);
    return centro;
  }

  async create(dto: CreateCentroCostoDto): Promise<CentroCosto> {
    // 1. Validar Código Duplicado
    const existe = await this.ccRepository.findOne({
      where: { codigo: dto.codigo },
    });
    if (existe)
      throw new BadRequestException(`El código ${dto.codigo} ya está en uso.`);

    // 2. Validar Padre y Niveles
    if (dto.id_padre) {
      const padre = await this.findOne(dto.id_padre);
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

  async update(id: number, dto: UpdateCentroCostoDto): Promise<CentroCosto> {
    const centro = await this.findOne(id);
    this.ccRepository.merge(centro, dto);
    return await this.ccRepository.save(centro);
  }

  async remove(id: number): Promise<void> {
    const centro = await this.findOne(id);
    if (centro.subcentros && centro.subcentros.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar un centro que tiene sub-niveles vinculados.',
      );
    }
    await this.ccRepository.remove(centro);
  }
}
