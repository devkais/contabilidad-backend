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

@Entity('cuenta')
export class Cuenta {
  @PrimaryGeneratedColumn()
  id_cuenta: number;

  @Column({ length: 50 })
  codigo: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'int' })
  nivel: number;

  @Column({ name: 'id_moneda', type: 'int' })
  id_moneda: number;

  @Column({ type: 'boolean', default: false })
  es_movimiento: boolean;

  @Column({ type: 'boolean', default: true })
  activa: boolean; // Usamos solo uno: 'activa'

  @Column({ name: 'id_empresa', type: 'int' })
  id_empresa: number;

  @Column({ name: 'tipo_cuenta', length: 50, nullable: true })
  tipo_cuenta: string;

  @Column({ name: 'id_padre', type: 'int', nullable: true })
  id_padre: number | null; // Consolidamos aquí id_cuenta_padre e id_padre

  // --- RELACIONES ---

  @ManyToOne(() => Moneda)
  @JoinColumn({ name: 'id_moneda' })
  moneda: Moneda;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => Cuenta, (cuenta) => cuenta.hijos)
  @JoinColumn({ name: 'id_padre' })
  padre: Cuenta;

  @OneToMany(() => Cuenta, (cuenta) => cuenta.padre)
  hijos: Cuenta[];
}
