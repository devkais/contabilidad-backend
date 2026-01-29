import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from './cuenta.entity';
import { CreateCuentaDto, UpdateCuentaDto } from './dto/cuenta.dto';

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
  ) {}

  async create(dto: CreateCuentaDto): Promise<Cuenta> {
    const { id_empresa, id_gestion, id_cuenta_padre, codigo } = dto;

    // 1. Evitar códigos duplicados en la misma gestión
    const existe = await this.cuentaRepository.findOne({
      where: { codigo, id_empresa, id_gestion },
    });
    if (existe)
      throw new ConflictException(`El código de cuenta ${codigo} ya existe.`);

    // 2. Lógica de Niveles y Jerarquía
    if (id_cuenta_padre) {
      const padre = await this.cuentaRepository.findOne({
        where: { id_cuenta: id_cuenta_padre, id_empresa },
      });

      if (!padre) throw new BadRequestException('La cuenta padre no existe.');
      if (padre.es_movimiento) {
        throw new BadRequestException(
          'No se puede colgar una cuenta de una que ya es de movimiento.',
        );
      }

      // El nivel debe ser el del padre + 1
      dto.nivel = padre.nivel + 1;
    } else {
      // Si no tiene padre, es nivel 1 (Activo, Pasivo, etc.)
      dto.nivel = 1;
    }

    const nuevaCuenta = this.cuentaRepository.create(dto);
    return await this.cuentaRepository.save(nuevaCuenta);
  }

  async findAllByContext(
    idEmpresa: number,
    idGestion: number,
  ): Promise<Cuenta[]> {
    return await this.cuentaRepository.find({
      where: { id_empresa: idEmpresa, id_gestion: idGestion },
      relations: ['moneda', 'padre'],
      order: { codigo: 'ASC' },
    });
  }

  /**
   * Método crítico para el AsientoService:
   * Solo permite obtener cuentas que acepten movimientos.
   */
  async findMovimientoOnly(id: number, idEmpresa: number): Promise<Cuenta> {
    const cuenta = await this.cuentaRepository.findOne({
      where: {
        id_cuenta: id,
        id_empresa: idEmpresa,
        es_movimiento: true,
        activo: true,
      },
    });

    if (!cuenta) {
      throw new BadRequestException(
        'La cuenta no es de movimiento, está inactiva o no existe.',
      );
    }
    return cuenta;
  }

  async update(
    id: number,
    id_empresa: number,
    dto: Partial<UpdateCuentaDto>,
  ): Promise<Cuenta> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cuenta: id, id_empresa },
    });

    if (!cuenta) throw new BadRequestException('Cuenta no encontrada.');

    // Solo permitimos actualizar ciertos campos para no romper la integridad
    // No permitimos cambiar id_empresa, id_gestion ni el código (si ya tiene movimientos)
    const updatedCuenta = this.cuentaRepository.merge(cuenta, {
      nombre: dto.nombre,
      id_moneda: dto.id_moneda,
      activo: dto.activo,
    });

    return await this.cuentaRepository.save(updatedCuenta);
  }

  async remove(id: number, id_empresa: number): Promise<void> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cuenta: id, id_empresa },
      relations: ['subcuentas'], // Importante para validar hijos
    });

    if (!cuenta) throw new BadRequestException('La cuenta no existe.');

    // REGLA DE ORO: No borrar si tiene hijos
    if (cuenta.subcuentas && cuenta.subcuentas.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar una cuenta que tiene subcuentas vinculadas.',
      );
    }

    // TODO: En el futuro, validar si tiene asientos contables antes de borrar

    await this.cuentaRepository.remove(cuenta);
  }
}
