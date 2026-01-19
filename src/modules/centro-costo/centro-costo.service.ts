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

  async findAll(id_empresa: number): Promise<CentroCosto[]> {
    return await this.ccRepository.find({
      where: { id_empresa },
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number, id_empresa: number): Promise<CentroCosto> {
    const centro = await this.ccRepository.findOne({
      where: { id_centro_costo: id, id_empresa },
    });
    if (!centro) throw new NotFoundException('Centro de costo no encontrado');
    return centro;
  }

  async create(dto: CreateCentroCostoDto): Promise<CentroCosto> {
    const existe = await this.ccRepository.findOne({
      where: { codigo: dto.codigo, id_empresa: dto.id_empresa },
    });
    if (existe)
      throw new BadRequestException(`El código ${dto.codigo} ya existe.`);

    const nuevo = this.ccRepository.create(dto);
    return await this.ccRepository.save(nuevo);
  }

  async update(
    id: number,
    dto: UpdateCentroCostoDto,
    id_empresa: number,
  ): Promise<CentroCosto> {
    const centro = await this.findOne(id, id_empresa);
    this.ccRepository.merge(centro, dto);
    return await this.ccRepository.save(centro);
  }

  async remove(id: number, id_empresa: number): Promise<void> {
    const centro = await this.findOne(id, id_empresa);
    await this.ccRepository.remove(centro);
  }
}
