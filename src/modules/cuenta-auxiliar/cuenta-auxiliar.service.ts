import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaAuxiliar } from './cuenta-auxiliar.entity';
import { CreateCuentaAuxiliarDto, UpdateCuentaAuxiliarDto } from './dto';

@Injectable()
export class CuentaAuxiliarService {
  constructor(
    @InjectRepository(CuentaAuxiliar)
    private readonly caRepository: Repository<CuentaAuxiliar>,
  ) {}

  async findAll(): Promise<CuentaAuxiliar[]> {
    return await this.caRepository.find({
      relations: ['padre'],
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CuentaAuxiliar> {
    const auxiliar = await this.caRepository.findOne({
      where: { id_cuenta_auxiliar: id },
      relations: ['padre', 'subauxiliares'],
    });
    if (!auxiliar)
      throw new NotFoundException(`Cuenta auxiliar con ID ${id} no encontrada`);
    return auxiliar;
  }

  async create(dto: CreateCuentaAuxiliarDto): Promise<CuentaAuxiliar> {
    // 1. Validar Código Duplicado
    const existe = await this.caRepository.findOne({
      where: { codigo: dto.codigo },
    });
    if (existe)
      throw new BadRequestException(
        `El código auxiliar ${dto.codigo} ya existe.`,
      );

    // 2. Validar Padre y Niveles
    if (dto.id_padre) {
      const padre = await this.findOne(dto.id_padre);
      if (dto.nivel !== padre.nivel + 1) {
        throw new BadRequestException(`El nivel debe ser ${padre.nivel + 1}`);
      }
    } else if (dto.nivel !== 1) {
      throw new BadRequestException('Un auxiliar raíz debe ser nivel 1.');
    }

    const nuevoAuxiliar = this.caRepository.create(dto);
    return await this.caRepository.save(nuevoAuxiliar);
  }

  async update(
    id: number,
    dto: UpdateCuentaAuxiliarDto,
  ): Promise<CuentaAuxiliar> {
    const auxiliar = await this.findOne(id);
    this.caRepository.merge(auxiliar, dto);
    return await this.caRepository.save(auxiliar);
  }

  async remove(id: number): Promise<void> {
    const auxiliar = await this.findOne(id);
    if (auxiliar.subauxiliares && auxiliar.subauxiliares.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar un auxiliar que tiene sub-niveles.',
      );
    }
    await this.caRepository.remove(auxiliar);
  }
}
