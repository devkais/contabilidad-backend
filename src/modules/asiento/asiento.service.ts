import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asiento } from './asiento.entity';
import { CreateAsientoDto } from './dto';
import { GestionService } from '../gestion/gestion.service';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';
import { TasaCambioService } from '../tasa-cambio/tasa-cambio.service';

@Injectable()
export class AsientoService {
  constructor(
    @InjectRepository(Asiento)
    private readonly asientoRepository: Repository<Asiento>,
    private readonly tasaCambioService: TasaCambioService,
    private readonly gestionService: GestionService,
  ) {}

  // Filtrado por Empresa y Gestión (Contexto de Login)

  async getallAsiento(
    id_empresa: number,

    id_gestion: number,
  ): Promise<Asiento[]> {
    return await this.asientoRepository.find({
      where: { id_empresa, id_gestion }, // <--- Solo los de esta empresa y gestión

      relations: ['gestion'],

      order: { fecha: 'DESC' },
    });
  }

  // Obtener por ID validando que sea de la empresa del usuario

  async getAsientoById(id: number, id_empresa: number): Promise<Asiento> {
    const asiento = await this.asientoRepository.findOne({
      where: { id_asiento: id, id_empresa }, // <--- Candado de seguridad

      relations: ['gestion', 'detalles'],
    });

    if (!asiento)
      throw new NotFoundException(
        `Asiento con ID ${id} no encontrado en esta empresa`,
      );

    return asiento;
  }

  async postAsiento(
    dto: CreateAsientoDto,
    id_usuario: number,
  ): Promise<Asiento> {
    const sumaDebe = dto.detalles.reduce(
      (acc, det) => acc + Number(det.debe_bs),
      0,
    );
    const sumaHaber = dto.detalles.reduce(
      (acc, det) => acc + Number(det.haber_bs),
      0,
    );

    if (Math.abs(sumaDebe - sumaHaber) > 0.01) {
      throw new BadRequestException(
        `El asiento no está cuadrado. Diferencia: ${sumaDebe - sumaHaber}`,
      );
    }
    if (!dto.tc_ufv_asiento) {
      try {
        const tasa = await this.tasaCambioService.getTasaByFecha(dto.fecha);
        dto.tc_ufv_asiento = tasa.cotizacion_ufv;
      } catch (error) {
        throw new BadRequestException(
          'No existe cotización UFV para esta fecha. Regístrela primero.',
        );
      }
    }

    const queryRunner =
      this.asientoRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const nuevoAsiento = queryRunner.manager.create(Asiento, {
        ...dto,
        created_by: id_usuario,
      });

      const asientoGuardado = await queryRunner.manager.save(nuevoAsiento);

      const detalles = dto.detalles.map((det) => ({
        ...det,
        id_asiento: asientoGuardado.id_asiento,
        id_empresa: dto.id_empresa,
      }));
      await queryRunner.manager.save(DetalleAsiento, detalles);

      await queryRunner.commitTransaction();
      return asientoGuardado;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // 4. Corregir el error de "Unsafe assignment" usando una validación de tipo
      const message = err instanceof Error ? err.message : 'Error desconocido';
      throw new BadRequestException(`Error al guardar el asiento: ${message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async putAsiento(
    id: number,

    dto: CreateAsientoDto,

    id_empresa: number,
  ): Promise<Asiento> {
    const asiento = await this.getAsientoById(id, id_empresa);

    this.asientoRepository.merge(asiento, dto);

    return await this.asientoRepository.save(asiento);
  }

  async deleteAsiento(id: number, id_empresa: number): Promise<void> {
    const asiento = await this.getAsientoById(id, id_empresa);

    // Nota: El SQL tiene ON DELETE CASCADE o restricción según definimos

    await this.asientoRepository.remove(asiento);
  }
}
