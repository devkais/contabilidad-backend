import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Gestion } from '../gestion/gestion.entity';

@Entity('centro_costo')
export class CentroCosto {
  @PrimaryGeneratedColumn({ name: 'id_centro_costo' })
  id_centro_costo: number;

  @Column({ name: 'id_empresa', type: 'int', nullable: false })
  id_empresa: number;

  @Column({ name: 'id_gestion', type: 'int', nullable: false })
  id_gestion: number;

  @Column({ length: 50, nullable: false })
  codigo: string;

  @Column({ length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // RELACIONES
  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => Gestion)
  @JoinColumn({ name: 'id_gestion' })
  gestion: Gestion;
}
