// src/modules/tasa-cambio/tasa-cambio.service.ts
/*import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasaCambio } from './tasa-cambio.entity';
import { BulkCreateTasaCambioDto } from './dto/create-tasa-cambio.dto';

@Injectable()
export class TasaCambioService {
  constructor(
    @InjectRepository(TasaCambio)
    private readonly tasaRepository: Repository<TasaCambio>,
  ) {}

  async getTasaByFecha(fecha: string | Date): Promise<TasaCambio> {
    const fechaBusqueda =
      typeof fecha === 'string' ? fecha : fecha.toISOString().split('T')[0];
    const tasa = await this.tasaRepository.findOne({
      where: {
        fecha: fechaBusqueda as any,
      },
    });

    if (!tasa) {
      throw new NotFoundException(
        `No hay tasas registradas para la fecha ${fechaBusqueda}`,
      );
    }
    return tasa;
  }
  async bulkCreate(dto: BulkCreateTasaCambioDto) {
    return await this.tasaRepository.upsert(
      dto.tasas.map((tasa) => ({
        fecha: tasa.fecha,
        cotizacion_usd: tasa.cotizacion_usd,
        cotizacion_ufv: tasa.cotizacion_ufv,
      })),
      ['fecha'], // Conflicto basado en la columna fecha
    );
  }
}
*/
