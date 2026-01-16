import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { DetalleAsiento } from './detalle-asiento.entity';

import { CreateDetalleAsientoDto } from './dto';

import { CuentaService } from '../cuenta/cuenta.service';

@Injectable()
export class DetalleAsientoService {
  constructor(
    @InjectRepository(DetalleAsiento)
    private readonly detalleRepository: Repository<DetalleAsiento>,

    private readonly cuentaService: CuentaService,
  ) {}

  async postDetalle(dto: CreateDetalleAsientoDto): Promise<DetalleAsiento> {
    // 1. Validar la cuenta pasando el id_empresa (Requisito Multi-empresa)

    const cuenta = await this.cuentaService.findOne(
      dto.id_cuenta,

      dto.id_empresa,
    );

    // 2. Validar que la cuenta sea de movimiento

    if (!cuenta.es_movimiento) {
      throw new BadRequestException(
        `La cuenta ${cuenta.codigo} no es una cuenta de movimiento.`,
      );
    }

    // 3. Crear el registro (el DTO ya debe traer id_empresa e id_asiento)

    const nuevoDetalle = this.detalleRepository.create(dto);

    return await this.detalleRepository.save(nuevoDetalle);
  }

  async getByAsiento(
    id_asiento: number,

    id_empresa: number,
  ): Promise<DetalleAsiento[]> {
    return await this.detalleRepository.find({
      where: { id_asiento, id_empresa }, // <--- Candado de seguridad

      relations: ['cuenta', 'centroCosto', 'cuentaAuxiliar'],
    });
  }

  async putDetalle(
    id: number,

    dto: CreateDetalleAsientoDto,

    id_empresa: number,
  ): Promise<DetalleAsiento> {
    const detalle = await this.detalleRepository.findOne({
      where: { id_detalle: id, id_empresa }, // <--- Candado de seguridad
    });

    if (!detalle)
      throw new NotFoundException(
        'Línea de detalle no encontrada en esta empresa',
      );

    // Si el DTO intenta cambiar la cuenta, validamos la nueva cuenta con la empresa

    if (dto.id_cuenta) {
      const cuenta = await this.cuentaService.findOne(
        dto.id_cuenta,

        id_empresa,
      );

      if (!cuenta.es_movimiento) {
        throw new BadRequestException(
          `La cuenta ${cuenta.codigo} no es de movimiento.`,
        );
      }
    }

    this.detalleRepository.merge(detalle, dto);

    return await this.detalleRepository.save(detalle);
  }

  async deleteDetalle(id: number, id_empresa: number): Promise<void> {
    // Usamos findOne para asegurar que pertenece a la empresa antes de borrar

    const detalle = await this.detalleRepository.findOne({
      where: { id_detalle: id, id_empresa },
    });

    if (!detalle) throw new NotFoundException('Línea de detalle no encontrada');

    await this.detalleRepository.remove(detalle);
  }
}
