import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Entity('cuenta_auxiliar')
export class CuentaAuxiliar {
  @PrimaryGeneratedColumn()
  id_cuenta_auxiliar: number;

  @Column({ length: 50, nullable: false })
  codigo: string;

  @Column({ length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'int', nullable: false })
  nivel: number;

  @Column({ name: 'id_padre', type: 'int', nullable: true })
  id_padre: number | null;

  // --- RELACIONES SEGÚN DBML ---

  @ManyToOne(() => CuentaAuxiliar, (ca) => ca.subauxiliares)
  @JoinColumn({ name: 'id_padre' })
  padre: CuentaAuxiliar;

  @OneToMany(() => CuentaAuxiliar, (ca) => ca.padre)
  subauxiliares: CuentaAuxiliar[];

  @OneToMany(() => DetalleAsiento, (detalle) => detalle.cuentaAuxiliar)
  detallesAsiento: DetalleAsiento[];
}
