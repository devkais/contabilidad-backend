import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from './cuenta.entity';
import { CreateCuentaDto } from './dto/cuenta.dto';

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
}
