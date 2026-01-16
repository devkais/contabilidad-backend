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

  // Filtrar auxiliares por empresa seleccionada
  async findAll(id_empresa: number): Promise<CuentaAuxiliar[]> {
    return await this.caRepository.find({
      where: { id_empresa }, // <--- FILTRO DE EMPRESA
      relations: ['padre'],
      order: { codigo: 'ASC' },
    });
  }

  // Buscar uno validando que pertenezca a la empresa
  async findOne(id: number, id_empresa: number): Promise<CuentaAuxiliar> {
    const auxiliar = await this.caRepository.findOne({
      where: { id_cuenta_auxiliar: id, id_empresa }, // <--- FILTRO DE EMPRESA
      relations: ['padre', 'subauxiliares'],
    });
    if (!auxiliar)
      throw new NotFoundException(
        `Cuenta auxiliar con ID ${id} no encontrada en esta empresa`,
      );
    return auxiliar;
  }

  async create(dto: CreateCuentaAuxiliarDto): Promise<CuentaAuxiliar> {
    // 1. Validar Código Duplicado DENTRO de la misma empresa
    const existe = await this.caRepository.findOne({
      where: { codigo: dto.codigo, id_empresa: dto.id_empresa },
    });
    if (existe)
      throw new BadRequestException(
        `El código auxiliar ${dto.codigo} ya existe en esta empresa.`,
      );

    // 2. Validar Padre y Niveles (Asegurando mismo contexto de empresa)
    if (dto.id_padre) {
      const padre = await this.findOne(dto.id_padre, dto.id_empresa); // <--- BUSCA PADRE EN LA MISMA EMPRESA
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
    id_empresa: number,
  ): Promise<CuentaAuxiliar> {
    const auxiliar = await this.findOne(id, id_empresa);

    // Validar código si cambia
    if (dto.codigo && dto.codigo !== auxiliar.codigo) {
      const existe = await this.caRepository.findOne({
        where: { codigo: dto.codigo, id_empresa },
      });
      if (existe) throw new BadRequestException('El código ya está en uso.');
    }

    this.caRepository.merge(auxiliar, dto);
    return await this.caRepository.save(auxiliar);
  }

  async remove(id: number, id_empresa: number): Promise<void> {
    const auxiliar = await this.findOne(id, id_empresa);
    if (auxiliar.subauxiliares && auxiliar.subauxiliares.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar un auxiliar que tiene sub-niveles.',
      );
    }
    await this.caRepository.remove(auxiliar);
  }
}
