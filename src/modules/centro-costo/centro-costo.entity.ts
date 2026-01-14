// src/modules/centro-costo/centro-costo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Entity('centro_costo')
export class CentroCosto {
  @PrimaryGeneratedColumn()
  id_centro_costo: number;

  @Column({ length: 50 })
  codigo: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ManyToOne(() => Empresa, (empresa) => empresa.centrosCosto)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @OneToMany(() => DetalleAsiento, (detalle) => detalle.centroCosto)
  detallesAsiento: DetalleAsiento[]; // <--- Verifica que este nombre sea exacto
}
