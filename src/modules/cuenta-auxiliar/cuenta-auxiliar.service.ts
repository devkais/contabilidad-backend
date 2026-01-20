import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
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

  async findAll(id_empresa: number): Promise<CuentaAuxiliar[]> {
    return await this.caRepository.find({
      where: { id_empresa },
      relations: ['padre'],
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number, id_empresa: number): Promise<CuentaAuxiliar> {
    const auxiliar = await this.caRepository.findOne({
      where: { id_cuenta_auxiliar: id, id_empresa },
      relations: ['padre', 'subauxiliares'],
    });
    if (!auxiliar)
      throw new NotFoundException(
        `Cuenta auxiliar no encontrada en esta empresa.`,
      );
    return auxiliar;
  }

  async create(dto: CreateCuentaAuxiliarDto): Promise<CuentaAuxiliar> {
    // Validar jerarquía
    if (dto.id_padre) {
      const padre = await this.findOne(dto.id_padre, dto.id_empresa);
      if (dto.nivel !== padre.nivel + 1) {
        throw new BadRequestException(
          `El nivel debe ser consecutivo al padre (${padre.nivel + 1}).`,
        );
      }
    }

    try {
      const nuevoAuxiliar = this.caRepository.create(dto);
      return await this.caRepository.save(nuevoAuxiliar);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException(
          `El código ${dto.codigo} ya existe en esta empresa.`,
        );
      }
      throw new InternalServerErrorException(
        'Error al crear la cuenta auxiliar',
      );
    }
  }

  async update(
    id: number,
    dto: UpdateCuentaAuxiliarDto,
    id_empresa: number,
  ): Promise<CuentaAuxiliar> {
    const auxiliar = await this.findOne(id, id_empresa);

    try {
      // Usamos Object.assign para mantener la consistencia del objeto
      Object.assign(auxiliar, dto);
      return await this.caRepository.save(auxiliar);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException(
          'El código ya está en uso por otra cuenta.',
        );
      }
      throw new InternalServerErrorException('Error al actualizar');
    }
  }

  async remove(id: number, id_empresa: number): Promise<boolean> {
    const auxiliar = await this.findOne(id, id_empresa);

    if (auxiliar.subauxiliares && auxiliar.subauxiliares.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar: tiene sub-cuentas dependientes.',
      );
    }

    const result = await this.caRepository.delete({
      id_cuenta_auxiliar: id,
      id_empresa,
    });
    return (result.affected ?? 0) > 0;
  }
}
