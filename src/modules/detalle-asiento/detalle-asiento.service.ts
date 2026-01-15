import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleAsiento } from './detalle-asiento.entity';
import { CreateDetalleAsientoDto, UpdateDetalleAsientoDto } from './dto';
import { CuentaService } from '../cuenta/cuenta.service';

@Injectable()
export class DetalleAsientoService {
  constructor(
    @InjectRepository(DetalleAsiento)
    private readonly detalleRepository: Repository<DetalleAsiento>,
    private readonly cuentaService: CuentaService,
  ) {}

  async postDetalle(dto: CreateDetalleAsientoDto): Promise<DetalleAsiento> {
    // Validar que la cuenta sea de movimiento (Requisito DBML: es_movimiento = true)
    const cuenta = await this.cuentaService.findOne(dto.id_cuenta);
    if (!cuenta.es_movimiento) {
      throw new BadRequestException(
        `La cuenta ${cuenta.codigo} no es una cuenta de movimiento.`,
      );
    }

    const nuevoDetalle = this.detalleRepository.create(dto);
    return await this.detalleRepository.save(nuevoDetalle);
  }

  async getByAsiento(id_asiento: number): Promise<DetalleAsiento[]> {
    return await this.detalleRepository.find({
      where: { id_asiento },
      relations: ['cuenta', 'centroCosto', 'cuentaAuxiliar'],
    });
  }

  async putDetalle(
    id: number,
    dto: UpdateDetalleAsientoDto,
  ): Promise<DetalleAsiento> {
    const detalle = await this.detalleRepository.findOne({
      where: { id_detalle: id },
    });
    if (!detalle) throw new NotFoundException('Línea de detalle no encontrada');

    this.detalleRepository.merge(detalle, dto);
    return await this.detalleRepository.save(detalle);
  }

  async deleteDetalle(id: number): Promise<void> {
    const result = await this.detalleRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Línea de detalle no encontrada');
  }
}
