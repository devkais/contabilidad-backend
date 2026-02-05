import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from './cuenta.entity';
import { CreateCuentaDto, UpdateCuentaDto } from './dto/cuenta.dto';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
    @InjectRepository(DetalleAsiento)
    private readonly detalleAsientoRepository: Repository<DetalleAsiento>,
  ) {}

  private async tieneMovimientos(id_cuenta: number): Promise<boolean> {
    const movimientos = await this.detalleAsientoRepository.findOne({
      where: { id_cuenta },
    });
    return !!movimientos;
  }

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

    const conMovimientos = await this.tieneMovimientos(id);

    if (conMovimientos) {
      // Si tiene movimientos y el usuario intenta cambiar la moneda...
      if (dto.id_moneda && dto.id_moneda !== cuenta.id_moneda) {
        throw new BadRequestException(
          'No se puede cambiar la moneda de una cuenta que ya tiene asientos registrados.',
        );
      }
      // El código no se suele enviar en el UpdateCuentaDto según tu código anterior,
      // pero si se enviara, aquí deberías bloquearlo también.
    }

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
      relations: ['subcuentas'],
    });

    if (!cuenta) throw new BadRequestException('La cuenta no existe.');

    // 1. Regla: No borrar si tiene hijos
    if (cuenta.subcuentas && cuenta.subcuentas.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar una cuenta que tiene subcuentas vinculadas.',
      );
    }

    // 2. Regla: No borrar si tiene asientos (movimientos)
    const conMovimientos = await this.tieneMovimientos(id);
    if (conMovimientos) {
      throw new BadRequestException(
        'Inposible eliminar: Esta cuenta ya tiene movimientos contables registrados. Considere marcarla como inactiva.',
      );
    }

    await this.cuentaRepository.remove(cuenta);
  }

  async clonarPlan(
    idEmpresa: number,
    idGestionOrigen: number,
    idGestionDestino: number,
  ): Promise<{ total: number }> {
    // 1. Obtener todas las cuentas de la gestión origen
    const cuentasOrigen = await this.cuentaRepository.find({
      where: { id_empresa: idEmpresa, id_gestion: idGestionOrigen },
      order: { nivel: 'ASC' }, // CRÍTICO: Procesar de nivel 1 hacia abajo
    });

    if (cuentasOrigen.length === 0) {
      throw new BadRequestException(
        'La gestión origen no tiene cuentas para clonar.',
      );
    }

    // 2. Usar una transacción para seguridad total
    return await this.cuentaRepository.manager.transaction(async (manager) => {
      // Mapa para rastrear { id_cuenta_viejo: id_cuenta_nuevo }
      const mapaIds = new Map<number, number>();
      let contador = 0;

      for (const cuenta of cuentasOrigen) {
        // Preparamos el objeto para la nueva cuenta
        const nuevaCuenta = manager.create(Cuenta, {
          ...cuenta,
          id_cuenta: undefined, // Dejamos que se genere uno nuevo
          id_gestion: idGestionDestino,
          // Si tiene padre, buscamos el nuevo ID del padre en nuestro mapa
          id_cuenta_padre: cuenta.id_cuenta_padre
            ? mapaIds.get(cuenta.id_cuenta_padre)
            : null,
        });

        const cuentaGuardada = await manager.save(nuevaCuenta);

        // Registramos el mapeo para que sus hijos puedan encontrarlo
        mapaIds.set(cuenta.id_cuenta, cuentaGuardada.id_cuenta);
        contador++;
      }

      return { total: contador };
    });
  }
}
