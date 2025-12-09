import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Asiento } from '../asiento/asiento.entity';
import { Cuenta } from '../cuenta/cuenta.entity';
import { CentroCosto } from '../centro-costo/centro-costo.entity';
import { CuentaAuxiliar } from '../cuenta-auxiliar/cuenta-auxiliar.entity';

@Entity('detalle_asiento') // Tabla: detalle_asiento
export class DetalleAsiento {
  @PrimaryGeneratedColumn()
  id_detalle: number; // PK

  // --- CRÍTICO: Movimiento en Monedas Separadas (DECIMAL 18, 2) ---
  // Estos campos contendrán el monto en el DEBE o HABER.
  // La validación en el servicio asegurará que solo uno sea mayor a cero por línea (Debe o Haber).
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  tipo_mov_debe_haber_bs: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  tipo_mov_debe_haber_usd: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  tipo_mov_debe_haber_ufv: number;

  // --- CLAVES FORÁNEAS (FKs) ---

  // 1. FK: id_asiento (Cabecera)
  @ManyToOne(() => Asiento, (asiento: Asiento) => asiento.detalles)
  @JoinColumn({ name: 'id_asiento' })
  asiento: Asiento;

  // 2. FK: id_cuenta (Estructura)
  @ManyToOne(() => Cuenta, (cuenta: Cuenta) => cuenta.detallesAsiento)
  @JoinColumn({ name: 'id_cuenta' })
  cuenta: Cuenta;

  // 3. FK: id_cuenta_auxiliar (Desagregación, opcional)
  @ManyToOne(
    () => CuentaAuxiliar,
    (cuentaAuxiliar: CuentaAuxiliar) => cuentaAuxiliar.detallesAsiento,
    { nullable: true },
  )
  @JoinColumn({ name: 'id_cuenta_auxiliar' })
  cuentaAuxiliar: CuentaAuxiliar;

  // 4. FK: id_centro_costo (Desagregación, opcional)
  @ManyToOne(
    () => CentroCosto,
    (centroCosto: CentroCosto) => centroCosto.detallesAsiento,
    { nullable: true },
  )
  @JoinColumn({ name: 'id_centro_costo' })
  centroCosto: CentroCosto;
}
