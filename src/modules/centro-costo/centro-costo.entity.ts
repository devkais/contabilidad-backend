import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';

@Entity('centro_costo')
export class CentroCosto {
  @PrimaryGeneratedColumn()
  id_centro_costo: number;

  @Column({ length: 50 })
  codigo: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ name: 'id_empresa', type: 'int' })
  id_empresa: number;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}
