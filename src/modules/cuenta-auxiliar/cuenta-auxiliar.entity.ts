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

@Entity('cuenta_auxiliar')
export class CuentaAuxiliar {
  @PrimaryGeneratedColumn({ name: 'id_cuenta_auxiliar' })
  id_cuenta_auxiliar: number;

  @Column({ name: 'id_empresa', type: 'int', nullable: false })
  id_empresa: number;

  @Column({ name: 'id_gestion', type: 'int', nullable: false })
  id_gestion: number;

  @Column({ name: 'id_padre', type: 'int', nullable: true })
  id_padre: number | null;

  @Column({ length: 50, nullable: false })
  codigo: string;

  @Column({ length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'int', nullable: false })
  nivel: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // RELACIONES
  @ManyToOne(() => CuentaAuxiliar, (aux) => aux.sub_auxiliares)
  @JoinColumn({ name: 'id_padre' })
  padre: CuentaAuxiliar;

  @OneToMany(() => CuentaAuxiliar, (aux) => aux.padre)
  sub_auxiliares: CuentaAuxiliar[];

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => Gestion)
  @JoinColumn({ name: 'id_gestion' })
  gestion: Gestion;
}
