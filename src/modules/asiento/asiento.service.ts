import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, Between } from 'typeorm';
import { Asiento } from './asiento.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';
import { Cuenta } from '../cuenta/cuenta.entity';
import { CreateAsientoDto } from './dto/asiento.dto';
import { MathUtil } from '../../common/utils/math.util';
import { UserRequest } from '../../auth/interfaces/auth.interface';

@Injectable()
export class AsientoService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Asiento)
    private readonly asientoRepository: Repository<Asiento>,
  ) {}

  async create(dto: CreateAsientoDto, user: UserRequest): Promise<Asiento> {
    const { detalles, ...cabecera } = dto;

    // 1. Validaciones básicas de integridad
    if (!detalles || detalles.length === 0) {
      throw new BadRequestException(
        'El asiento debe tener al menos un detalle',
      );
    }

    const totalDebe = detalles.reduce(
      (sum, det) => sum + (Number(det.debe_bs) || 0),
      0,
    );
    const totalHaber = detalles.reduce(
      (sum, det) => sum + (Number(det.haber_bs) || 0),
      0,
    );

    if (!MathUtil.isBalanced(totalDebe, totalHaber)) {
      throw new BadRequestException(
        `El asiento no está cuadrado en BS. Debe: ${totalDebe}, Haber: ${totalHaber}.`,
      );
    }

    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. Validar Cuentas (deben ser de movimiento y de la misma empresa)
      for (const det of detalles) {
        const cuenta = await queryRunner.manager.findOne(Cuenta, {
          where: { id_cuenta: det.id_cuenta, id_empresa: user.id_empresa },
        });

        if (!cuenta) {
          throw new BadRequestException(
            `Cuenta con ID ${det.id_cuenta} no encontrada.`,
          );
        }

        if (!cuenta.es_movimiento) {
          throw new BadRequestException(
            `La cuenta ${cuenta.codigo} no es de movimiento y no puede registrar asientos.`,
          );
        }
      }

      // 3. Generar número correlativo por mes (Ej: ING-001)
      const fechaAsiento = new Date(cabecera.fecha);
      const primerDiaMes = new Date(
        fechaAsiento.getFullYear(),
        fechaAsiento.getMonth(),
        1,
      );
      const ultimoDiaMes = new Date(
        fechaAsiento.getFullYear(),
        fechaAsiento.getMonth() + 1,
        0,
      );

      const totalMes = await queryRunner.manager.count(Asiento, {
        where: {
          id_empresa: user.id_empresa,
          id_gestion: user.id_gestion,
          tipo_asiento: cabecera.tipo_asiento,
          fecha: Between(primerDiaMes, ultimoDiaMes),
        },
      });

      const correlativo = (totalMes + 1).toString().padStart(3, '0');
      const prefijo = cabecera.tipo_asiento.substring(0, 3).toUpperCase();
      const numeroGenerado = `${prefijo}-${correlativo}`;

      // 4. Crear Cabecera (Usamos los TCs que vienen del DTO)
      const nuevoAsiento = queryRunner.manager.create(Asiento, {
        ...cabecera,
        id_empresa: user.id_empresa,
        id_gestion: user.id_gestion,
        created_by: user.id_usuario,
        numero_comprobante: numeroGenerado,
        fecha: fechaAsiento,
        tc_oficial_asiento: MathUtil.roundExchangeRate(
          cabecera.tc_oficial_asiento,
        ),
        // Cambiamos null por undefined para satisfacer a DeepPartial
        tc_ufv_asiento: cabecera.tc_ufv_asiento
          ? MathUtil.roundExchangeRate(cabecera.tc_ufv_asiento)
          : undefined,
      });

      const asientoGuardado = await queryRunner.manager.save(nuevoAsiento);

      // 5. Crear Detalles (Cálculos bi-monetarios automáticos basados en cabecera)
      const tc = nuevoAsiento.tc_oficial_asiento;
      const tc_ufv = nuevoAsiento.tc_ufv_asiento;

      const detallesEntities = detalles.map((det) => {
        const d_bs = Number(det.debe_bs) || 0;
        const h_bs = Number(det.haber_bs) || 0;

        return queryRunner.manager.create(DetalleAsiento, {
          ...det,
          id_asiento: asientoGuardado.id_asiento,
          id_empresa: user.id_empresa,
          id_gestion: user.id_gestion,
          // Guardado en BS con redondeo contable
          debe_bs: MathUtil.roundMoney(d_bs),
          haber_bs: MathUtil.roundMoney(h_bs),
          // Conversión automática a $US usando el TC de la cabecera
          debe_sus: MathUtil.roundMoney(d_bs / tc),
          haber_sus: MathUtil.roundMoney(h_bs / tc),
          // Conversión a UFV si aplica
          monto_ufv:
            tc_ufv && tc_ufv > 0
              ? MathUtil.roundExchangeRate((d_bs + h_bs) / tc_ufv)
              : 0,
        });
      });

      await queryRunner.manager.save(DetalleAsiento, detallesEntities);

      await queryRunner.commitTransaction();
      return asientoGuardado;
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) throw error;

      const mensaje =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new InternalServerErrorException(
        `Error al registrar asiento: ${mensaje}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(idEmpresa: number, idGestion: number): Promise<Asiento[]> {
    return await this.asientoRepository.find({
      where: { id_empresa: idEmpresa, id_gestion: idGestion },
      relations: ['detalles', 'detalles.cuenta'],
      order: { fecha: 'DESC', numero_comprobante: 'DESC' },
    });
  }
}
