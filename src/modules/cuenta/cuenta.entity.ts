import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity'; // La necesitaremos para la relación

@Entity('cuenta') // Nombre de la tabla: cuenta
export class Cuenta {
  @PrimaryGeneratedColumn()
  id_cuenta: number; // PK

  @Column({ length: 10, unique: true })
  codigo: string; // El código de cuenta (ej: 110501)

  @Column({ length: 255 })
  nombre: string;

  @Column()
  nivel: number; // Nivel de la cuenta en la jerarquía (ej: 1, 2, 3...)

  @Column({ length: 50 })
  tipo_cuenta: string; // Activo, Pasivo, Patrimonio, Ingreso, Egreso

  @Column({ type: 'boolean', default: false })
  es_movimiento: boolean; // Indica si se puede registrar un movimiento contable en esta cuenta (solo cuentas de último nivel)

  // ------------------------------------------
  // RELACIÓN RECURSIVA (Jerarquía del Plan de Cuentas)
  // ------------------------------------------

  // Muchos a Uno (Cuenta Padre): Una cuenta puede tener UN padre.
  @ManyToOne(() => Cuenta, (cuenta) => cuenta.hijas, {
    nullable: true, // La cuenta raíz (ej. 'Activo') no tiene padre
  })
  @JoinColumn({ name: 'id_cuenta_padre' }) // La clave foránea que apunta a esta misma tabla
  padre: Cuenta;

  // Uno a Muchos (Cuentas Hijas): Una cuenta padre puede tener MUCHAS cuentas hijas.
  @OneToMany(() => Cuenta, (cuenta) => cuenta.padre)
  hijas: Cuenta[];

  // ------------------------------------------
  // RELACIÓN con Detalle_Asiento
  // ------------------------------------------

  // Uno a Muchos (Una Cuenta tiene muchos Detalle_Asientos)
  @OneToMany(() => DetalleAsiento, (detalle) => detalle.cuenta)
  detallesAsiento: DetalleAsiento[];
}
