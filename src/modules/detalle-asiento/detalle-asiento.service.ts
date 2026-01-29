import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleAsiento } from './detalle-asiento.entity';
import { MathUtil } from '../../common/utils/math.util';

@Injectable()
export class DetalleAsientoService {
  constructor(
    @InjectRepository(DetalleAsiento)
    private readonly detalleRepository: Repository<DetalleAsiento>,
  ) {}

  /**
   * Obtiene los movimientos de una cuenta específica (Libro Mayor).
   */
  async getMovimientosByCuenta(
    idCuenta: number,
    idEmpresa: number,
    idGestion: number,
  ): Promise<DetalleAsiento[]> {
    return await this.detalleRepository.find({
      where: {
        id_cuenta: idCuenta,
        id_empresa: idEmpresa,
        id_gestion: idGestion,
      },
      relations: ['asiento'], // Para saber en qué fecha y comprobante ocurrió
      order: { asiento: { fecha: 'ASC' } },
    });
  }

  /**
   * Sumatoria de saldos para estados financieros.
   * Devuelve los totales calculados asegurando precisión decimal.
   */
  async getTotalesByGestion(
    idEmpresa: number,
    idGestion: number,
  ): Promise<{ debe: number; haber: number }> {
    const resultados = await this.detalleRepository
      .createQueryBuilder('detalle')
      .select('SUM(detalle.debe_bs)', 'totalDebe')
      .select('SUM(detalle.haber_bs)', 'totalHaber')
      .where('detalle.id_empresa = :idEmpresa', { idEmpresa })
      .andWhere('detalle.id_gestion = :idGestion', { idGestion })
      .getRawOne<{ totalDebe: string; totalHaber: string }>();

    return {
      debe: MathUtil.roundMoney(Number(resultados?.totalDebe || 0)),
      haber: MathUtil.roundMoney(Number(resultados?.totalHaber || 0)),
    };
  }
}
