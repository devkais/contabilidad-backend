import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { TipoCambio } from './tipo-cambio.entity';
import { CreateTipoCambioDto } from './dto/tipo-cambio.dto';
import { MathUtil } from '../../common/utils/math.util';

@Injectable()
export class TipoCambioService {
  constructor(
    @InjectRepository(TipoCambio)
    private readonly tcRepository: Repository<TipoCambio>,
  ) {}

  async create(dto: CreateTipoCambioDto): Promise<TipoCambio> {
    const fechaBusqueda = new Date(dto.fecha);
    // 1. Validar que no exista ya un TC para esa fecha y moneda
    const existe = await this.tcRepository.findOne({
      where: {
        id_moneda_destino: dto.id_moneda_destino,
        fecha: fechaBusqueda,
      },
    });

    if (existe) {
      throw new BadRequestException(
        `Ya existe un tipo de cambio para la fecha ${dto.fecha}`,
      );
    }

    // 2. Aplicar redondeo de precisión a 6 decimales con nuestra utilitaria
    const nuevoTc = this.tcRepository.create({
      ...dto,
      oficial: MathUtil.roundExchangeRate(dto.oficial),
      venta: dto.venta ? MathUtil.roundExchangeRate(dto.venta) : undefined,
      compra: dto.compra ? MathUtil.roundExchangeRate(dto.compra) : undefined,
    });

    return await this.tcRepository.save(nuevoTc);
  }

  /**
   * Obtiene el tipo de cambio vigente para una fecha.
   * Si no hay para la fecha exacta, busca el último disponible hacia atrás.
   */
  async getVigente(
    idMoneda: number,
    fecha: string | Date,
  ): Promise<TipoCambio> {
    const fechaDate = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const tc = await this.tcRepository.findOne({
      where: {
        id_moneda_destino: idMoneda,
        fecha: LessThanOrEqual(fechaDate),
      },
      order: { fecha: 'DESC' },
    });

    if (!tc) {
      throw new NotFoundException(
        `No hay tipo de cambio registrado para la moneda ${idMoneda} en la fecha ${fechaDate.toISOString().split('T')[0]}`,
      );
    }

    return tc;
  }

  async findAll(): Promise<TipoCambio[]> {
    return await this.tcRepository.find({
      relations: ['moneda'],
      order: { fecha: 'DESC' },
      take: 30, // Retornamos los últimos 30 por defecto
    });
  }
}
