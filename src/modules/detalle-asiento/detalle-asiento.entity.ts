import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Asiento } from '../asiento/asiento.entity';
import { Cuenta } from '../cuenta/cuenta.entity';
import { Empresa } from '../empresa/empresa.entity';
import { CentroCosto } from '../centro-costo/centro-costo.entity';
import { CuentaAuxiliar } from '../cuenta-auxiliar/cuenta-auxiliar.entity';

@Entity('detalle_asiento')
export class DetalleAsiento {
  @PrimaryGeneratedColumn()
  id_detalle: number;

  @Column({ name: 'id_asiento', type: 'int', nullable: false })
  id_asiento: number;

  @Column({ name: 'id_cuenta', type: 'int', nullable: false })
  id_cuenta: number;

  @Column({ name: 'id_empresa', type: 'int', nullable: false })
  id_empresa: number;

  @Column({ name: 'id_centro_costo', type: 'int', nullable: true })
  id_centro_costo: number | null;

  @Column({ name: 'id_cuenta_auxiliar', type: 'int', nullable: true })
  id_cuenta_auxiliar: number | null;

  @Column({ length: 255, nullable: true })
  glosa_detalle: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  debe_bs: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  haber_bs: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  debe_sus: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  haber_sus: number;

  @Column({ length: 10, nullable: true })
  codigo_flujo: string;

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  monto_ufv: number; // monto_bs / tc_ufv_asiento

  // --- RELACIONES ---

  @ManyToOne(() => Asiento, (asiento) => asiento.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_asiento' })
  asiento: Asiento;

  @ManyToOne(() => Cuenta)
  @JoinColumn({ name: 'id_cuenta' })
  cuenta: Cuenta;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => CentroCosto)
  @JoinColumn({ name: 'id_centro_costo' })
  centroCosto: CentroCosto;

  @ManyToOne(() => CuentaAuxiliar, { nullable: true })
  @JoinColumn({ name: 'id_cuenta_auxiliar' })
  cuentaAuxiliar: CuentaAuxiliar;
}
