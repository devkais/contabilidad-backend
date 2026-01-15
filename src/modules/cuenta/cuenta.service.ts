import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from './cuenta.entity';
import { CreateCuentaDto, UpdateCuentaDto } from './dto';
import { MonedaService } from '../moneda/moneda.service';

@Injectable()
export class CuentaService {
  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
    private readonly monedaService: MonedaService,
  ) {}

  async findAll(): Promise<Cuenta[]> {
    return await this.cuentaRepository.find({
      relations: ['moneda', 'padre'],
      order: { codigo: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Cuenta> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id_cuenta: id },
      relations: ['moneda', 'padre', 'subcuentas'],
    });
    if (!cuenta)
      throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
    return cuenta;
  }

  async create(dto: CreateCuentaDto): Promise<Cuenta> {
    // 1. Validar Moneda
    await this.monedaService.findOne(dto.id_moneda);

    // 2. Validar Código Duplicado
    const existe = await this.cuentaRepository.findOne({
      where: { codigo: dto.codigo },
    });
    if (existe)
      throw new BadRequestException(`El código ${dto.codigo} ya está en uso.`);

    // 3. Validar Padre (si existe) y niveles
    if (dto.id_cuenta_padre) {
      const padre = await this.findOne(dto.id_cuenta_padre);
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

  async update(id: number, dto: UpdateCuentaDto): Promise<Cuenta> {
    const cuenta = await this.findOne(id);
    this.cuentaRepository.merge(cuenta, dto);
    return await this.cuentaRepository.save(cuenta);
  }

  async remove(id: number): Promise<void> {
    const cuenta = await this.findOne(id);
    if (cuenta.subcuentas && cuenta.subcuentas.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar una cuenta que tiene subcuentas.',
      );
    }
    await this.cuentaRepository.remove(cuenta);
  }
}
