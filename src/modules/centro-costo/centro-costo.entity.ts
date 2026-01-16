// src/modules/centro-costo/centro-costo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';
import { Empresa } from '../empresa/empresa.entity';

@Entity('centro_costo')
export class CentroCosto {
  @PrimaryGeneratedColumn()
  id_centro_costo: number;

  @Column({ length: 50, nullable: false })
  codigo: string;

  @Column({ length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'int', nullable: false })
  nivel: number;

  @Column({ name: 'id_padre', type: 'int', nullable: true })
  id_padre: number | null;

  @Column({ name: 'id_empresa', type: 'int' })
  id_empresa: number;

  // --- RELACIONES SEGÚN DBML ---

  @ManyToOne(() => CentroCosto, (cc) => cc.subcentros)
  @JoinColumn({ name: 'id_padre' })
  padre: CentroCosto;

  @OneToMany(() => CentroCosto, (cc) => cc.padre)
  subcentros: CentroCosto[];

  @OneToMany(() => DetalleAsiento, (detalle) => detalle.centroCosto)
  detallesAsiento: DetalleAsiento[];

  @ManyToOne(() => Empresa, (empresa) => empresa.centros_costo)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}
