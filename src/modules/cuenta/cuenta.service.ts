import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from './cuenta.entity';
import { CreateCuentaDto } from './dto';
import { MonedaService } from '../moneda/moneda.service';

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
    private readonly monedaService: MonedaService,
  ) {}

  // Ahora filtramos el Plan de Cuentas por Empresa
  async findAll(id_empresa: number): Promise<Cuenta[]> {
    return await this.cuentaRepository.find({
      where: { id_empresa }, // <--- FILTRO VITAL
      relations: ['moneda', 'padre'],
      order: { codigo: 'ASC' },
    });
  }

  // Buscamos la cuenta asegurando que pertenece a la empresa actual
  async findOne(id: number, id_empresa: number): Promise<Cuenta> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cuenta: id, id_empresa }, // <--- FILTRO VITAL
      relations: ['moneda', 'padre', 'subcuentas'],
    });
    if (!cuenta)
      throw new NotFoundException(
        `Cuenta con ID ${id} no encontrada en esta empresa`,
      );
    return cuenta;
  }

  async create(dto: CreateCuentaDto): Promise<Cuenta> {
    // 1. Validar Moneda (La moneda suele ser global, no necesita id_empresa)
    await this.monedaService.findOne(dto.id_moneda);

    // 2. Validar Código Duplicado SOLO dentro de esta empresa
    const existe = await this.cuentaRepository.findOne({
      where: { codigo: dto.codigo, id_empresa: dto.id_empresa }, // <--- AJUSTE
    });
    if (existe)
      throw new BadRequestException(
        `El código ${dto.codigo} ya está en uso en esta empresa.`,
      );

    // 3. Validar Padre (si existe) y niveles dentro de la empresa
    if (dto.id_cuenta_padre) {
      const padre = await this.findOne(dto.id_cuenta_padre, dto.id_empresa); // <--- VALIDAR PADRE DE LA MISMA EMPRESA
      if (padre.es_movimiento) {
        throw new BadRequestException(
          'No se puede crear una subcuenta bajo una cuenta de movimiento.',
        );
      }
      if (dto.nivel !== padre.nivel + 1) {
        throw new BadRequestException(`El nivel debe ser ${padre.nivel + 1}`);
      }
    } else if (dto.nivel !== 1) {
      throw new BadRequestException('Una cuenta sin padre debe ser nivel 1.');
    }

    const nuevaCuenta = this.cuentaRepository.create(dto);
    return await this.cuentaRepository.save(nuevaCuenta);
  }

  async update(
    id: number,
    dto: CreateCuentaDto,
    id_empresa: number,
  ): Promise<Cuenta> {
    const cuenta = await this.findOne(id, id_empresa);

    // Validar duplicado si está cambiando el código
    if (dto.codigo && dto.codigo !== cuenta.codigo) {
      const existe = await this.cuentaRepository.findOne({
        where: { codigo: dto.codigo, id_empresa },
      });
      if (existe)
        throw new BadRequestException(`El código ${dto.codigo} ya existe.`);
    }

    this.cuentaRepository.merge(cuenta, dto);
    return await this.cuentaRepository.save(cuenta);
  }

  async remove(id: number, id_empresa: number): Promise<void> {
    const cuenta = await this.findOne(id, id_empresa);
    if (cuenta.subcuentas && cuenta.subcuentas.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar una cuenta que tiene subcuentas.',
      );
    }
    await this.cuentaRepository.remove(cuenta);
  }
}
