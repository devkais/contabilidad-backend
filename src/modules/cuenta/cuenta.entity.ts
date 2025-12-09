import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Gestion } from '../gestion/gestion.entity';
import { Moneda } from '../moneda/moneda.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Entity('cuenta') // Tabla: cuenta
export class Cuenta {
  @PrimaryGeneratedColumn()
  id_cuenta: number; // PK

  @Column({ length: 50 })
  codigo: string;

  @Column({ length: 255 })
  nombre: string;

  @Column()
  nivel: number; // Nivel de la cuenta (ej: 1, 2, 3...)

  @Column({ length: 20 })
  clase_cuenta: string; // Activo, Pasivo, Patrimonio, Ingreso, Gasto, Costo

  @Column({ type: 'boolean', default: true })
  activo: boolean; // Si la cuenta está activa

  @Column({ type: 'boolean' })
  es_movimiento: boolean; // True si es una cuenta de nivel de detalle (último nivel)

  // ------------------------------------------
  // RELACIÓN RECURSIVA (Jerarquía del Plan de Cuentas)
  // ------------------------------------------

  // Muchos a Uno (Cuenta Padre)
  @ManyToOne(() => Cuenta, (cuenta: Cuenta) => cuenta.hijas, { nullable: true })
  @JoinColumn({ name: 'id_cuenta_padre' })
  padre: Cuenta;

  // Uno a Muchos (Cuentas Hijas)
  @OneToMany(() => Cuenta, (cuenta: Cuenta) => cuenta.padre)
  hijas: Cuenta[];

  // --- CLAVES FORÁNEAS (FKs) ---

  // Muchos a Uno con Empresa
  @ManyToOne(() => Empresa, (empresa) => empresa.cuentas)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  // Muchos a Uno con Gestión
  @ManyToOne(() => Gestion, (gestion) => gestion.cuentas)
  @JoinColumn({ name: 'id_gestion' })
  gestion: Gestion;

  // Muchos a Uno con Moneda
  @ManyToOne(() => Moneda, (moneda) => moneda.cuentas)
  @JoinColumn({ name: 'id_moneda' })
  moneda: Moneda;

  // --- RELACIÓN con Detalle_Asiento ---

  // Uno a Muchos (Una Cuenta tiene muchos Detalle_Asientos)
  @OneToMany(() => DetalleAsiento, (detalle: DetalleAsiento) => detalle.cuenta)
  detallesAsiento: DetalleAsiento[];
}
