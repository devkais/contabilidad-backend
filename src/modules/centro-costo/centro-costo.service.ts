import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CentroCosto } from './centro-costo.entity';
import {
  CreateCentroCostoDto,
  UpdateCentroCostoDto,
} from './dto/centro-costo.dto';

@Injectable()
export class CentroCostoService {
  constructor(
    @InjectRepository(CentroCosto)
    private readonly centroCostoRepository: Repository<CentroCosto>,
  ) {}

  async create(dto: CreateCentroCostoDto): Promise<CentroCosto> {
    // Validar duplicado de código en la misma gestión/empresa
    const existe = await this.centroCostoRepository.findOne({
      where: {
        codigo: dto.codigo,
        id_empresa: dto.id_empresa,
        id_gestion: dto.id_gestion,
      },
    });

    if (existe) {
      throw new ConflictException(
        `El código de centro de costo ${dto.codigo} ya existe en esta gestión`,
      );
    }

    const nuevoCC = this.centroCostoRepository.create(dto);
    return await this.centroCostoRepository.save(nuevoCC);
  }

  async findAllByContext(
    idEmpresa: number,
    idGestion: number,
  ): Promise<CentroCosto[]> {
    return await this.centroCostoRepository.find({
      where: { id_empresa: idEmpresa, id_gestion: idGestion },
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number, idEmpresa: number): Promise<CentroCosto> {
    const cc = await this.centroCostoRepository.findOne({
      where: { id_centro_costo: id, id_empresa: idEmpresa },
    });

    if (!cc) {
      throw new NotFoundException('Centro de costo no encontrado');
    }
    return cc;
  }

  async update(
    id: number,
    idEmpresa: number,
    dto: UpdateCentroCostoDto,
  ): Promise<CentroCosto> {
    const cc = await this.findOne(id, idEmpresa);
    const actualizado = Object.assign(cc, dto);
    return await this.centroCostoRepository.save(actualizado);
  }
}
