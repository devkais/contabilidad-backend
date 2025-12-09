import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Entity('centro_costo') // Tabla: centro_costo
export class CentroCosto {
  @PrimaryGeneratedColumn()
  id_centro_costo: number; // PK

  @Column({ length: 50 })
  codigo: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // --- FK: id_empresa ---
  // Muchos a Uno con Empresa
  @ManyToOne(() => Empresa, (empresa: Empresa) => empresa.centrosCosto)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  // --- RELACIÓN con DetalleAsiento ---
  // Uno a Muchos: Un Centro de Costo puede tener muchos Detalles de Asiento asociados
  @OneToMany(
    () => DetalleAsiento,
    (detalle: DetalleAsiento) => detalle.centroCosto,
  )
  detallesAsiento: DetalleAsiento[];
}
