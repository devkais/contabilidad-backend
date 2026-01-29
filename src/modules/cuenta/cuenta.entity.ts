import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Moneda } from '../moneda/moneda.entity';
import { Empresa } from '../empresa/empresa.entity';
import { Gestion } from '../gestion/gestion.entity';

@Entity('cuenta')
export class Cuenta {
  @PrimaryGeneratedColumn({ name: 'id_cuenta' })
  id_cuenta: number;

  @Column({ name: 'id_empresa', type: 'int', nullable: false })
  id_empresa: number;

  @Column({ name: 'id_gestion', type: 'int', nullable: false })
  id_gestion: number;

  @Column({ name: 'id_moneda', type: 'int', nullable: false })
  id_moneda: number;

  @Column({ name: 'id_cuenta_padre', type: 'int', nullable: true })
  id_cuenta_padre: number | null;

  @Column({ length: 50, nullable: false })
  codigo: string; // Ej: 1.1.1.01.001

  @Column({ length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'int', nullable: false })
  nivel: number; // 1 al 5

  @Column({ name: 'clase_cuenta', length: 20, nullable: true })
  clase_cuenta: string; // Activo, Pasivo, etc.

  @Column({ name: 'es_movimiento', type: 'boolean', default: false })
  es_movimiento: boolean; // Solo nivel 5 recibe asientos

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // --- RELACIONES ---

  @ManyToOne(() => Cuenta, (cuenta) => cuenta.subcuentas)
  @JoinColumn({ name: 'id_cuenta_padre' })
  padre: Cuenta;

  @OneToMany(() => Cuenta, (cuenta) => cuenta.padre)
  subcuentas: Cuenta[];

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => Gestion)
  @JoinColumn({ name: 'id_gestion' })
  gestion: Gestion;

  @ManyToOne(() => Moneda)
  @JoinColumn({ name: 'id_moneda' })
  moneda: Moneda;
}
