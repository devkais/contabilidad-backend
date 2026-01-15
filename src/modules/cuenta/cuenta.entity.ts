import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Moneda } from '../moneda/moneda.entity';

@Entity('cuenta')
export class Cuenta {
  @PrimaryGeneratedColumn()
  id_cuenta: number;

  @Column({ length: 50, nullable: false })
  codigo: string;

  @Column({ length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'int', nullable: false })
  nivel: number;

  @Column({ name: 'id_cuenta_padre', type: 'int', nullable: true })
  id_cuenta_padre: number | null;

  @Column({ name: 'id_moneda', type: 'int', nullable: false })
  id_moneda: number;

  @Column({ length: 20, nullable: true })
  clase_cuenta: string; // Activo, Pasivo, Patrimonio, Ingreso, Gasto

  @Column({ type: 'boolean', nullable: false })
  es_movimiento: boolean; // Solo nivel 5 puede transaccionar

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // --- RELACIONES SEGÚN DBML ---

  @ManyToOne(() => Cuenta, (cuenta) => cuenta.subcuentas)
  @JoinColumn({ name: 'id_cuenta_padre' })
  padre: Cuenta;

  @OneToMany(() => Cuenta, (cuenta) => cuenta.padre)
  subcuentas: Cuenta[];

  @ManyToOne(() => Moneda, (moneda) => moneda.cuentas)
  @JoinColumn({ name: 'id_moneda' })
  moneda: Moneda;
}
