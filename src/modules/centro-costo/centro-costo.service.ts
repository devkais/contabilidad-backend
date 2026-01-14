import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CentroCosto } from './centro-costo.entity';
import { CreateCentroCostoDto, UpdateCentroCostoDto } from './dto';

@Injectable()
export class CentroCostoService {
  constructor(
    @InjectRepository(CentroCosto)
    private readonly centroRepository: Repository<CentroCosto>,
  ) {}

  async getallCentros(id_empresa: number) {
    return await this.centroRepository.find({
      where: {
        empresa: { id_empresa: id_empresa },
      },
      order: { codigo: 'ASC' },
    });
  }

  async postCentroCosto(dto: CreateCentroCostoDto) {
    const { id_empresa, ...datos } = dto;

    const nuevoCentro = this.centroRepository.create({
      ...datos,
      empresa: { id_empresa } as any,
    });

    return await this.centroRepository.save(nuevoCentro);
  }

  async putCentroCosto(id: number, dto: UpdateCentroCostoDto) {
    const centro = await this.centroRepository.preload({
      id_centro_costo: id,
      ...dto,
    });
    if (!centro) throw new NotFoundException('Centro de costo no encontrado');
    return await this.centroRepository.save(centro);
  }

  async deleteCentroCosto(id: number) {
    const result = await this.centroRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getCentroCostoById(id: number) {
    const centro = await this.centroRepository.findOne({
      where: { id_centro_costo: id },
    });

    if (!centro) {
      throw new NotFoundException(`Centro de costo con ID ${id} no encontrado`);
    }

    return centro;
  }
}
