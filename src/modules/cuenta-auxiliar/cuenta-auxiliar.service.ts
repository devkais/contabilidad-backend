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

  async findAll(id_empresa: number): Promise<any[]> {
    return await this.caRepository
      .createQueryBuilder('ca')
      .leftJoinAndSelect('ca.padre', 'padre')
      .loadRelationCountAndMap('ca.movimientosCount', 'ca.detallesAsiento') // Esto cuenta los asientos vinculados
      .where('ca.id_empresa = :id_empresa', { id_empresa })
      .orderBy('ca.codigo', 'ASC')
      .getMany();
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

  //  Método create actualizado
  async create(dto: CreateCuentaAuxiliarDto): Promise<CuentaAuxiliar> {
    // 1. VALIDACIÓN PREVENTIVA DE DUPLICADOS
    const exists = await this.caRepository.findOne({
      where: {
        codigo: dto.codigo,
        id_empresa: dto.id_empresa,
      },
    });

    if (exists) {
      throw new ConflictException(
        `El código "${dto.codigo}" ya está registrado en esta empresa.`,
      );
    }

    // 2. Validar jerarquía limitada a 2 niveles (Tu lógica actual)
    if (dto.id_padre) {
      const padre = await this.findOne(dto.id_padre, dto.id_empresa);
      if (padre.nivel >= 2) {
        throw new BadRequestException(
          'No se pueden crear sub-cuentas de tercer nivel.',
        );
      }
      if (dto.nivel !== padre.nivel + 1) {
        throw new BadRequestException(
          `El nivel debe ser consecutivo al padre (${padre.nivel + 1}).`,
        );
      }
    } else if (dto.nivel !== 1) {
      throw new BadRequestException(
        'Una cuenta sin padre debe ser de Nivel 1.',
      );
    }

    try {
      const nuevoAuxiliar = this.caRepository.create(dto);
      return await this.caRepository.save(nuevoAuxiliar);
    } catch (error: any) {
      // Captura por si acaso ocurre una condición de carrera
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException(`El código ${dto.codigo} ya existe.`);
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
    // Buscamos el auxiliar con sus relaciones
    const auxiliar = await this.caRepository.findOne({
      where: { id_cuenta_auxiliar: id, id_empresa },
      relations: ['detallesAsiento'],
    });

    if (!auxiliar) throw new NotFoundException('Cuenta no encontrada.');

    // VALIDACIÓN DE INTEGRIDAD: Cambio de código
    if (dto.codigo && dto.codigo !== auxiliar.codigo) {
      if (auxiliar.detallesAsiento && auxiliar.detallesAsiento.length > 0) {
        throw new BadRequestException(
          'Prohibido: No se puede cambiar el código de una cuenta que ya tiene movimientos contables.',
        );
      }
    }

    try {
      Object.assign(auxiliar, dto);
      return await this.caRepository.save(auxiliar);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        throw new ConflictException('El código ya está en uso.');
      }
      throw new InternalServerErrorException('Error al actualizar');
    }
  }

  async remove(id: number, id_empresa: number): Promise<boolean> {
    // Cargamos subauxiliares y detallesAsiento para validar integridad
    const auxiliar = await this.caRepository.findOne({
      where: { id_cuenta_auxiliar: id, id_empresa },
      relations: ['subauxiliares', 'detallesAsiento'],
    });

    if (!auxiliar) {
      throw new NotFoundException('La cuenta no existe.');
    }

    // REGLA 1: No borrar si tiene hijos
    if (auxiliar.subauxiliares && auxiliar.subauxiliares.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar: tiene sub-cuentas dependientes. Elimine los hijos primero.',
      );
    }

    // REGLA 2: No borrar si tiene movimientos contables
    if (auxiliar.detallesAsiento && auxiliar.detallesAsiento.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar: esta cuenta ya tiene transacciones registradas.',
      );
    }

    const result = await this.caRepository.delete({
      id_cuenta_auxiliar: id,
      id_empresa,
    });

    return (result.affected ?? 0) > 0;
  }

  async getSuggestNextCode(
    id_empresa: number,
    id_padre?: number,
  ): Promise<{ nextCode: string }> {
    const query = this.caRepository
      .createQueryBuilder('ca')
      .where('ca.id_empresa = :id_empresa', { id_empresa });

    if (id_padre) {
      // Buscamos el código del padre para conocer el prefijo
      const padre = await this.caRepository.findOne({
        where: { id_cuenta_auxiliar: id_padre },
      });
      if (!padre) throw new NotFoundException('Padre no encontrado');

      // Buscamos el hijo con el código más alto que empiece por el código del padre
      const lastChild = await query
        .andWhere('ca.id_padre = :id_padre', { id_padre })
        .orderBy('ca.codigo', 'DESC')
        .getOne();

      if (!lastChild) {
        // Si es el primer hijo, sugerimos CódigoPadre + "01"
        return { nextCode: `${padre.codigo}01` };
      }

      // Si ya hay hijos, incrementamos el último
      const lastNum = parseInt(lastChild.codigo.slice(padre.codigo.length));
      const nextNum = (lastNum + 1).toString().padStart(2, '0');
      return { nextCode: `${padre.codigo}${nextNum}` };
    } else {
      // Si es nivel 1, buscamos el código máximo de nivel 1
      const lastRoot = await query
        .andWhere('ca.id_padre IS NULL')
        .orderBy('ca.codigo', 'DESC')
        .getOne();

      if (!lastRoot) return { nextCode: '1' };

      const nextVal = parseInt(lastRoot.codigo) + 1;
      return { nextCode: nextVal.toString() };
    }
  }
}
