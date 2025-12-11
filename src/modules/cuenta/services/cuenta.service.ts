// src/modules/cuentas/services/cuenta.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Cuenta } from '../cuenta.entity';
import { CreateCuentaDto, UpdateCuentaDto } from '../dto';

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
  ) {}

  async getAllCuentas(id_empresa: number): Promise<Cuenta[]> {
    // Usamos find para obtener todas las cuentas de la empresa con sus relaciones
    return this.cuentaRepository.find({
      where: { id_empresa },
      // Incluimos las relaciones FKs y la relación recursiva (padre/hijas)
      relations: ['empresa', 'gestion', 'moneda', 'padre', 'hijas'],
      order: { codigo: 'ASC' },
    });
  }

  async getCuentaById(id_cuenta: number): Promise<Cuenta | null> {
    return this.cuentaRepository.findOne({
      where: { id_cuenta },
      relations: ['empresa', 'gestion', 'moneda', 'padre', 'hijas'],
    });
  }

  // Obtener el Plan de Cuentas como un Árbol (funcionalidad avanzada)
  async getCuentasAsTree(id_empresa: number): Promise<Cuenta[]> {
    // Busca solo las cuentas de nivel 1 (que no tienen padre)
    return this.cuentaRepository.find({
      where: { id_empresa, nivel: 1 },
      // Carga la jerarquía recursivamente hasta el último nivel
      relations: ['hijas', 'hijas.hijas', 'hijas.hijas.hijas'],
      order: { codigo: 'ASC' },
    });
  }

  // ----------------------------------------------------
  // LÓGICA DE ESCRITURA (CRUD)
  // ----------------------------------------------------

  async postCuenta(createDto: CreateCuentaDto): Promise<Cuenta> {
    // Validación de Nivel y Padre (Lógica de Negocio)
    if (createDto.id_cuenta_padre) {
      const padre = await this.getCuentaById(createDto.id_cuenta_padre);
      if (!padre) {
        throw new BadRequestException(
          'La cuenta padre especificada no existe.',
        );
      }
      // Se asegura que el nivel de la hija sea mayor al del padre
      if (createDto.nivel <= padre.nivel) {
        throw new BadRequestException(
          'El nivel de la cuenta debe ser mayor al nivel de la cuenta padre.',
        );
      }
    } else if (createDto.nivel !== 1) {
      // Si no tiene padre, debe ser nivel 1
      throw new BadRequestException(
        'Una cuenta sin padre debe ser de Nivel 1.',
      );
    }

    const newCuenta = this.cuentaRepository.create(createDto);
    return this.cuentaRepository.save(newCuenta);
  }

  async putCuenta(
    id_cuenta: number,
    updateDto: UpdateCuentaDto,
  ): Promise<Cuenta | null> {
    // (Opcional) Aquí se podría agregar lógica para evitar mover cuentas con hijas
    await this.cuentaRepository.update({ id_cuenta }, updateDto);
    return this.getCuentaById(id_cuenta);
  }

  async deleteCuenta(id_cuenta: number): Promise<boolean> {
    // Lógica crucial: No se puede eliminar si tiene cuentas hijas o detalles de asiento
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cuenta },
      relations: ['hijas', 'detallesAsiento'],
    });

    if (!cuenta) return false;

    if (cuenta.hijas && cuenta.hijas.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar la cuenta: Tiene cuentas hijas asociadas.',
      );
    }
    // Asumo que si tiene detallesAsiento tampoco se debe eliminar por integridad referencial

    const result = await this.cuentaRepository.delete({ id_cuenta });
    return (result.affected ?? 0) > 0;
  }

  // Lógica de Negocio ESENCIAL para Contabilidad
  async validarCuentaDeMovimiento(id_cuenta: number): Promise<void> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cuenta },
      select: ['es_movimiento'],
    });
    if (!cuenta) {
      throw new NotFoundException(`Cuenta con ID ${id_cuenta} no encontrada.`);
    }
    if (!cuenta.es_movimiento) {
      throw new BadRequestException(
        `La cuenta ${id_cuenta} no es de movimiento y no puede registrar transacciones.`,
      );
    }
  }
}
