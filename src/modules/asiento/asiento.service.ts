import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Asiento } from './asiento.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';
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

    // 1. Validar que existan detalles
    if (!detalles || detalles.length === 0) {
      throw new BadRequestException(
        'El asiento debe tener al menos un detalle',
      );
    }

    // 2. Validar balance de sumas (Debe vs Haber) usando MathUtil
    const totalDebe = detalles.reduce(
      (sum, det) => sum + (det.debe_bs || 0),
      0,
    );
    const totalHaber = detalles.reduce(
      (sum, det) => sum + (det.haber_bs || 0),
      0,
    );

    if (!MathUtil.isBalanced(totalDebe, totalHaber)) {
      throw new BadRequestException(
        `El asiento no está cuadrado. Debe: ${totalDebe}, Haber: ${totalHaber}. Dif: ${Math.abs(totalDebe - totalHaber)}`,
      );
    }

    // 3. Iniciar Transacción Atómica
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 4. Crear Cabecera
      const nuevoAsiento = queryRunner.manager.create(Asiento, {
        ...cabecera,
        id_empresa: user.id_empresa,
        id_gestion: user.id_gestion,
        created_by: user.id_usuario,
        fecha: new Date(cabecera.fecha),
      });

      const asientoGuardado = await queryRunner.manager.save(nuevoAsiento);

      // 5. Crear Detalles amarrados al ID de la cabecera
      const detallesEntities = detalles.map((det) => {
        return queryRunner.manager.create(DetalleAsiento, {
          ...det,
          id_asiento: asientoGuardado.id_asiento,
          id_empresa: user.id_empresa,
          id_gestion: user.id_gestion,
        });
      });

      await queryRunner.manager.save(DetalleAsiento, detallesEntities);

      // 6. Confirmar cambios
      await queryRunner.commitTransaction();

      // Retornar el asiento completo
      return asientoGuardado;
    } catch (error: unknown) {
      // Si algo falla, deshacemos todo
      await queryRunner.rollbackTransaction();
      const mensaje =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new InternalServerErrorException(
        `Error al registrar asiento: ${mensaje}`,
      );
    } finally {
      // Liberar el query runner
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
