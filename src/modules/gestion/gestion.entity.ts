import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';

@Entity('gestion')
export class Gestion {
  @PrimaryGeneratedColumn()
  id_gestion: number;

  @Column({ name: 'id_empresa', type: 'int', nullable: false })
  id_empresa: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ type: 'date', nullable: false })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: false })
  fecha_fin: Date;

  @Column({ length: 20, default: 'abierto' })
  estado: string; // abierto, cerrado

  // Relaciones según DBML
  @ManyToOne(() => Empresa, (empresa) => empresa.gestiones)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}
