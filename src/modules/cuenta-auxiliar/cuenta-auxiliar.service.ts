import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaAuxiliar } from './cuenta-auxiliar.entity';
import { CreateCuentaAuxiliarDto } from './dto/cuenta-auxiliar.dto';

@Injectable()
export class CuentaAuxiliarService {
  constructor(
    @InjectRepository(CuentaAuxiliar)
    private readonly auxiliarRepository: Repository<CuentaAuxiliar>,
  ) {}

  async create(dto: CreateCuentaAuxiliarDto): Promise<CuentaAuxiliar> {
    // 1. Si tiene padre, validar que exista y sea de la misma empresa/gestión
    if (dto.id_padre) {
      const padre = await this.auxiliarRepository.findOne({
        where: { id_cuenta_auxiliar: dto.id_padre, id_empresa: dto.id_empresa },
      });
      if (!padre)
        throw new BadRequestException(
          'La cuenta auxiliar padre no existe o no pertenece a esta empresa',
        );
    }

    // 2. Validar que el código no esté duplicado en este contexto
    const existeCodigo = await this.auxiliarRepository.findOne({
      where: {
        codigo: dto.codigo,
        id_empresa: dto.id_empresa,
        id_gestion: dto.id_gestion,
      },
    });
    if (existeCodigo)
      throw new BadRequestException(`El código ${dto.codigo} ya está en uso`);

    const nuevaAuxiliar = this.auxiliarRepository.create(dto);
    return await this.auxiliarRepository.save(nuevaAuxiliar);
  }

  /**
   * Obtiene los auxiliares del contexto actual.
   * Se puede filtrar para obtener solo las "hojas" del árbol.
   */
  async findAllByContext(
    idEmpresa: number,
    idGestion: number,
  ): Promise<CuentaAuxiliar[]> {
    return await this.auxiliarRepository.find({
      where: { id_empresa: idEmpresa, id_gestion: idGestion },
      relations: ['id_padre'], // Cargamos la relación recursiva
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number, idEmpresa: number): Promise<CuentaAuxiliar> {
    const auxiliar = await this.auxiliarRepository.findOne({
      where: { id_cuenta_auxiliar: id, id_empresa: idEmpresa },
    });

    if (!auxiliar) throw new NotFoundException('Cuenta auxiliar no encontrada');
    return auxiliar;
  }
}
