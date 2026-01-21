import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Cuenta } from '../cuenta/cuenta.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

// Interfaces para tipar las respuestas de la BD
interface SaldoRaw {
  id_cuenta: string;
  saldo: string;
}

interface SaldoResultadoRaw {
  id_cuenta: string;
  saldo_ingreso: string;
  saldo_egreso: string;
}

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
    @InjectRepository(DetalleAsiento)
    private readonly detalleRepository: Repository<DetalleAsiento>,
  ) {}

  private formatFechaSQL(fecha: string | Date): string {
    const d = new Date(fecha);
    return d.toISOString().split('T')[0];
  }

  // ==========================================
  // 1. BALANCE GENERAL (CON CUADRE AUTOMÁTICO)
  // ==========================================
  async generarBalanceGeneral(id_empresa: number, fecha_corte?: string) {
    const fechaLimpia = this.formatFechaSQL(fecha_corte || new Date());

    const cuentas = await this.cuentaRepository.find({
      where: { id_empresa, activa: true },
      order: { codigo: 'ASC' },
    });

    // Obtenemos saldos de todas las cuentas
    const saldosRaw: SaldoRaw[] = await this.detalleRepository
      .createQueryBuilder('detalle')
      .innerJoin('detalle.asiento', 'asiento')
      .select('detalle.id_cuenta', 'id_cuenta')
      .addSelect('SUM(detalle.debe_bs) - SUM(detalle.haber_bs)', 'saldo')
      .where('detalle.id_empresa = :id_empresa', { id_empresa })
      .andWhere('asiento.fecha <= :fecha', { fecha: fechaLimpia })
      .andWhere('asiento.estado = :estado', { estado: 'valido' })
      .groupBy('detalle.id_cuenta')
      .getRawMany();

    const saldosMap = new Map<number, number>(
      saldosRaw.map((s) => [parseInt(s.id_cuenta, 10), parseFloat(s.saldo)]),
    );

    // --- CÁLCULO DE UTILIDAD PARA CUADRE ---
    // Ingresos (4) - Gastos (5)
    const ingresosTotal = saldosRaw
      .filter((s) => {
        const c = cuentas.find(
          (cta) => cta.id_cuenta === parseInt(s.id_cuenta),
        );
        return c?.codigo.startsWith('4');
      })
      .reduce((acc, s) => acc + (parseFloat(s.saldo) * -1), 0); // Invertimos signo para ingresos

    const egresosTotal = saldosRaw
      .filter(s => {
        const c = cuentas.find(
          (cta) => cta.id_cuenta === parseInt(s.id_cuenta),
        );
        return c?.codigo.startsWith('5');
      })
      .reduce((acc, s) => acc + parseFloat(s.saldo), 0);

    const utilidadDelEjercicio = ingresosTotal - egresosTotal;

    const estructurarCuentas = (idPadre: number | null = null): any[] => {
      return cuentas
        .filter((c) => c.id_padre === idPadre && ['1','2','3'].includes(c.codigo[0]))
        .map((cuenta) => {
          let hijos = estructurarCuentas(cuenta.id_cuenta);
          let saldoAcumulado = hijos.length > 0
              ? hijos.reduce((acc, h) => acc + h.saldo, 0)
              : saldosMap.get(cuenta.id_cuenta) || 0;

          // Si es la cuenta raíz de PATRIMONIO (Código 3), le inyectamos la utilidad
          if (cuenta.codigo === '3') {
            saldoAcumulado += utilidadDelEjercicio;
            hijos.push({
              id_cuenta: 9999,
              codigo: '3.9.9',
              nombre: 'UTILIDAD/PÉRDIDA DEL EJERCICIO',
              nivel: 2,
              saldo: utilidadDelEjercicio,
              hijos: [],
            });
          }

          // Ajuste de signo visual para Pasivo y Patrimonio
          let saldoFinal = saldoAcumulado;
          if (cuenta.codigo.startsWith('2') || cuenta.codigo.startsWith('3')) {
            saldoFinal = Math.abs(saldoAcumulado);
          }

          return {
            id_cuenta: cuenta.id_cuenta,
            codigo: cuenta.codigo,
            nombre: cuenta.nombre,
            nivel: cuenta.nivel,
            tipo_cuenta: cuenta.tipo_cuenta,
            saldo: saldoFinal,
            hijos: hijos,
          };
        })
        .filter((c) => c.saldo !== 0 || c.hijos.length > 0);
    };

    return estructurarCuentas(null);
  }

  // ==========================================
  // 2. ESTADO DE RESULTADOS (OPTIMIZADO)
  // ==========================================
  async generarEstadoResultados(
    id_empresa: number,
    fecha_inicio: string,
    fecha_fin: string,
    id_centro_costo?: number,
  ) {
    const inicio = this.formatFechaSQL(fecha_inicio);
    const fin = this.formatFechaSQL(fecha_fin);

    const cuentas = await this.cuentaRepository.find({
      where: [
        { id_empresa, activa: true, codigo: Like('4%') }, // Ingresos
        { id_empresa, activa: true, codigo: Like('5%') }, // Egresos
      ],
      order: { codigo: 'ASC' },
    });

    const saldosRaw: SaldoResultadoRaw[] = await this.detalleRepository
      .createQueryBuilder('detalle')
      .innerJoin('detalle.asiento', 'asiento')
      .select('detalle.id_cuenta', 'id_cuenta')
      .addSelect(
        'SUM(detalle.haber_bs) - SUM(detalle.debe_bs)',
        'saldo_ingreso',
      )
      .addSelect('SUM(detalle.debe_bs) - SUM(detalle.haber_bs)', 'saldo_egreso')
      .where('detalle.id_empresa = :id_empresa', { id_empresa })
      .andWhere('asiento.fecha BETWEEN :inicio AND :fin', { inicio, fin })
      .andWhere('asiento.estado = :estado', { estado: 'valido' })
      .groupBy('detalle.id_cuenta')
      .getRawMany();

    const saldosMap = new Map<number, number>();
    saldosRaw.forEach((s) => {
      const cuentaId = parseInt(s.id_cuenta, 10);
      const cuenta = cuentas.find((c) => c.id_cuenta === cuentaId);
      const valor = cuenta?.codigo.startsWith('4')
        ? parseFloat(s.saldo_ingreso)
        : parseFloat(s.saldo_egreso);
      saldosMap.set(cuentaId, valor);
    });

    const estructurar = (idPadre: number | null = null): any[] => {
      return cuentas
        .filter((c) => c.id_padre === idPadre)
        .map((cuenta) => {
          const hijos = estructurar(cuenta.id_cuenta);
          const saldoTotal = hijos.length > 0
              ? hijos.reduce((acc, h) => acc + h.saldo, 0)
              : saldosMap.get(cuenta.id_cuenta) || 0;

          return {
            id_cuenta: cuenta.id_cuenta,
            codigo: cuenta.codigo,
            nombre: cuenta.nombre,
            nivel: cuenta.nivel,
            tipo_cuenta: cuenta.tipo_cuenta,
            saldo: saldoTotal,
            hijos: hijos,
          };
        })
        .filter((c) => c.saldo !== 0 || c.hijos.length > 0);
    };
    const query = this.detalleRepository
      .createQueryBuilder('detalle')
      .innerJoin('detalle.asiento', 'asiento')
      .select('detalle.id_cuenta', 'id_cuenta')
      .where('detalle.id_empresa = :id_empresa', { id_empresa })
      .andWhere('asiento.fecha BETWEEN :inicio AND :fin', { inicio, fin })
      .andWhere('asiento.estado = :estado', { estado: 'valido' });

    if (id_centro_costo) {
      query.andWhere('detalle.id_centro_costo = :id_centro_costo', {
        id_centro_costo,
      });
    }

    const reporte = estructurar(null);
    const ingresos = reporte.filter(c => c.codigo.startsWith('4')).reduce((a, b) => a + b.saldo, 0);
    const egresos = reporte.filter(c => c.codigo.startsWith('5')).reduce((a, b) => a + b.saldo, 0);

    return {
      reporte,
      utilidad_neta: ingresos - egresos,
    };
  }

  // ==========================================
  // 3. LIBRO MAYOR
  // ==========================================
  async generarLibroMayor(
    id_empresa: number,
    id_cuenta: number,
    fecha_inicio: string,
    fecha_fin: string,
  ) {
    const inicio = this.formatFechaSQL(fecha_inicio);
    const fin = this.formatFechaSQL(fecha_fin);

    const saldoAnteriorRaw = await this.detalleRepository
      .createQueryBuilder('detalle')
      .innerJoin('detalle.asiento', 'asiento')
      .select('SUM(detalle.debe_bs) - SUM(detalle.haber_bs)', 'saldo')
      .where('detalle.id_empresa = :id_empresa', { id_empresa })
      .andWhere('detalle.id_cuenta = :id_cuenta', { id_cuenta })
      .andWhere('asiento.fecha < :inicio', { inicio })
      .andWhere('asiento.estado = :estado', { estado: 'valido' })
      .getRawOne<{ saldo: string }>();

    const saldoAnterior = parseFloat(saldoAnteriorRaw?.saldo || '0');

    const movimientos = await this.detalleRepository
      .createQueryBuilder('detalle')
      .innerJoinAndSelect('detalle.asiento', 'asiento')
      .where('detalle.id_empresa = :id_empresa', { id_empresa })
      .andWhere('detalle.id_cuenta = :id_cuenta', { id_cuenta })
      .andWhere('asiento.fecha BETWEEN :inicio AND :fin', { inicio, fin })
      .andWhere('asiento.estado = :estado', { estado: 'valido' })
      .orderBy('asiento.fecha', 'ASC')
      .addOrderBy('asiento.id_asiento', 'ASC')
      .getMany();

    let saldoCorriente = saldoAnterior;
    const detalleConSaldos = movimientos.map((m) => {
      saldoCorriente += Number(m.debe_bs) - Number(m.haber_bs);
      return {
        fecha: this.formatFechaSQL(m.asiento.fecha),
        comprobante: m.asiento.numero_comprobante,
        glosa: m.glosa_detalle || m.asiento.glosa_general,
        debe: m.debe_bs,
        haber: m.haber_bs,
        saldo_acumulado: saldoCorriente,
      };
    });

    return {
      id_cuenta,
      saldo_anterior: saldoAnterior,
      movimientos: detalleConSaldos,
      saldo_final: saldoCorriente,
    };
  }
}
