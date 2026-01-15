import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCambio } from './tipo-cambio.entity';
import { CreateTipoCambioDto, UpdateTipoCambioDto } from './dto';
import { MonedaService } from '../moneda/moneda.service';

@Injectable()
export class TipoCambioService {
  constructor(
    @InjectRepository(TipoCambio)
    private readonly tcRepository: Repository<TipoCambio>,
    private readonly monedaService: MonedaService,
  ) {}

  async findAll(): Promise<TipoCambio[]> {
    return await this.tcRepository.find({
      relations: ['monedaDestino'],
      order: { fecha: 'DESC' },
    });
  }

  async findByFecha(fecha: string): Promise<TipoCambio[]> {
    return await this.tcRepository.find({
      where: { fecha: new Date(fecha) },
      relations: ['monedaDestino'],
    });
  }

  async create(dto: CreateTipoCambioDto): Promise<TipoCambio> {
    // Validar que la moneda existe
    await this.monedaService.findOne(dto.id_moneda_destino);

    // Evitar duplicados de fecha y moneda
    const existe = await this.tcRepository.findOne({
      where: {
        fecha: new Date(dto.fecha),
        id_moneda_destino: dto.id_moneda_destino,
      },
    });

    if (existe) {
      throw new BadRequestException(
        'Ya existe un tipo de cambio para esta fecha y moneda.',
      );
    }

    const nuevoTc = this.tcRepository.create({
      ...dto,
      fecha: new Date(dto.fecha),
    });
    return await this.tcRepository.save(nuevoTc);
  }

  async update(id: number, dto: UpdateTipoCambioDto): Promise<TipoCambio> {
    const tc = await this.tcRepository.findOne({
      where: { id_tipo_cambio: id },
    });
    if (!tc) throw new NotFoundException('Tipo de cambio no encontrado');

    this.tcRepository.merge(tc, dto);
    return await this.tcRepository.save(tc);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tcRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Tipo de cambio no encontrado');
  }
}
