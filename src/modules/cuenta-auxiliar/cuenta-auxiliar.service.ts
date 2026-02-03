import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaAuxiliar } from './cuenta-auxiliar.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';
import {
  CreateCuentaAuxiliarDto,
  UpdateCuentaAuxiliarDto,
} from './dto/cuenta-auxiliar.dto';

@Injectable()
export class CuentaAuxiliarService {
  constructor(
    @InjectRepository(CuentaAuxiliar)
    private readonly auxiliarRepository: Repository<CuentaAuxiliar>,
    @InjectRepository(DetalleAsiento)
    private readonly detalleAsientoRepository: Repository<DetalleAsiento>,
  ) {}

  async suggestNextCode(
    id_empresa: number,
    id_gestion: number,
    id_padre: number | null,
  ) {
    // CASO A: Es una cuenta de Nivel 1 (Sin padre)
    if (!id_padre || id_padre === null) {
      const last = await this.auxiliarRepository.findOne({
        where: { id_empresa, id_gestion, nivel: 1 },
        order: { codigo: 'DESC' },
      });

      // Si no hay ninguna, empezamos en 100. Si hay, sumamos 100 (100, 200, 300...)
      const nextNum = last
        ? (Math.floor(parseInt(last.codigo) / 100) + 1) * 100
        : 100;
      return { nextCode: nextNum.toString() };
    }

    // CASO B: Es una cuenta de Nivel 2 (Tiene padre)
    else {
      const padre = await this.auxiliarRepository.findOne({
        where: { id_cuenta_auxiliar: id_padre },
      });

      if (!padre) throw new NotFoundException('La cuenta padre no existe.');

      // Buscamos el último hijo de este padre específico
      const lastHijo = await this.auxiliarRepository.findOne({
        where: { id_padre, id_empresa, id_gestion },
        order: { codigo: 'DESC' },
      });

      // Si es el primer hijo: tomamos el código del padre y le añadimos "-01"
      if (!lastHijo) {
        return { nextCode: `${padre.codigo}-01` };
      }

      // Si ya hay hijos: incrementamos el correlativo después del guion
      const parts = lastHijo.codigo.split('-');
      const lastCorrelativo = parseInt(parts[parts.length - 1]);
      const nextCorrelativo = (lastCorrelativo + 1).toString().padStart(2, '0');

      return { nextCode: `${padre.codigo}-${nextCorrelativo}` };
    }
  }

  async create(dto: CreateCuentaAuxiliarDto): Promise<CuentaAuxiliar> {
    if (dto.id_padre) {
      const padre = await this.auxiliarRepository.findOne({
        where: { id_cuenta_auxiliar: dto.id_padre, id_empresa: dto.id_empresa },
      });
      if (!padre) throw new BadRequestException('La cuenta padre no existe.');
      if (padre.nivel >= 2)
        throw new BadRequestException(
          'Solo se permiten 2 niveles de jerarquía.',
        );
      dto.nivel = 2;
    } else {
      dto.nivel = 1;
    }

    const existeCodigo = await this.auxiliarRepository.findOne({
      where: {
        codigo: dto.codigo,
        id_empresa: dto.id_empresa,
        id_gestion: dto.id_gestion,
      },
    });
    if (existeCodigo)
      throw new BadRequestException(`El código ${dto.codigo} ya está en uso`);

    const nuevaAuxiliar = this.auxiliarRepository.create(dto);
    return await this.auxiliarRepository.save(nuevaAuxiliar);
  }

  async findAllByContext(
    id_empresa: number,
    id_gestion: number,
  ): Promise<any[]> {
    const auxiliares = await this.auxiliarRepository.find({
      where: { id_empresa, id_gestion },
      order: { codigo: 'ASC' },
    });

    // Retorna el conteo real de movimientos contables para cada auxiliar
    return await Promise.all(
      auxiliares.map(async (aux) => {
        const count = await this.detalleAsientoRepository.count({
          where: { id_cuenta_auxiliar: aux.id_cuenta_auxiliar },
        });
        return { ...aux, movimientosCount: count };
      }),
    );
  }

  async findOne(
    id_cuenta_auxiliar: number,
    id_empresa: number,
  ): Promise<CuentaAuxiliar> {
    const auxiliar = await this.auxiliarRepository.findOne({
      where: { id_cuenta_auxiliar, id_empresa },
    });
    if (!auxiliar) throw new NotFoundException('Cuenta auxiliar no encontrada');
    return auxiliar;
  }

  async update(
    id_cuenta_auxiliar: number,
    id_empresa: number,
    dto: UpdateCuentaAuxiliarDto,
  ) {
    const aux = await this.findOne(id_cuenta_auxiliar, id_empresa);

    // Validación de movimientos para restringir edición de campos sensibles
    const count = await this.detalleAsientoRepository.count({
      where: { id_cuenta_auxiliar },
    });

    if (count > 0) {
      if (dto.codigo && dto.codigo !== aux.codigo) {
        throw new ForbiddenException(
          'No se puede cambiar el código de un auxiliar con movimientos contables.',
        );
      }
      if (dto.id_empresa && dto.id_empresa !== aux.id_empresa) {
        throw new ForbiddenException(
          'No se puede cambiar la empresa de un auxiliar con movimientos contables.',
        );
      }
    }

    Object.assign(aux, dto);
    return await this.auxiliarRepository.save(aux);
  }

  async remove(id_cuenta_auxiliar: number, id_empresa: number) {
    const aux = await this.findOne(id_cuenta_auxiliar, id_empresa);

    // 1. Validar jerarquía (no borrar si tiene hijos)
    const tieneHijos = await this.auxiliarRepository.count({
      where: { id_padre: id_cuenta_auxiliar },
    });
    if (tieneHijos > 0)
      throw new BadRequestException(
        'No se puede eliminar una cuenta con sub-cuentas.',
      );

    // 2. Validar movimientos (especificación contable)
    const count = await this.detalleAsientoRepository.count({
      where: { id_cuenta_auxiliar },
    });

    if (count > 0) {
      throw new ForbiddenException(
        'No se puede eliminar un auxiliar con movimientos contables.',
      );
    }

    return await this.auxiliarRepository.remove(aux);
  }
}
