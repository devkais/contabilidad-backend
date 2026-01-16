import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Gestion } from '../gestion/gestion.entity';
import { Usuario } from '../usuario/usuario.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';
import { Empresa } from '../empresa/empresa.entity';

@Entity('asiento')
export class Asiento {
  @PrimaryGeneratedColumn()
  id_asiento: number;

  @Column({ type: 'date', nullable: false })
  fecha: Date;

  @Column({ length: 100, nullable: false })
  numero_comprobante: string;

  @Column({ type: 'text', nullable: false })
  glosa_general: string;

  @Column({ length: 20, nullable: false })
  tipo_asiento: string; // Ingreso, Egreso, Traspaso, Ajuste

  @Column({ length: 20, default: 'contabilizado' })
  estado: string; // borrador, contabilizado, anulado

  @Column({ name: 'id_gestion', type: 'int', nullable: false })
  id_gestion: number;

  @Column({ name: 'created_by', type: 'int', nullable: false })
  created_by: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  tc_oficial_asiento: number;

  @Column({ length: 50, default: 'MANUAL' })
  sistema_origen: string;

  @Column({ length: 100, nullable: true })
  external_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ name: 'id_empresa', type: 'int' })
  id_empresa: number;

  @ManyToOne(() => Empresa, (empresa) => empresa.asientos)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
  // --- RELACIONES ---

  @ManyToOne(() => Gestion, (gestion) => gestion.asientos)
  @JoinColumn({ name: 'id_gestion' })
  gestion: Gestion;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'created_by' })
  usuario_creador: Usuario;

  @OneToMany(() => DetalleAsiento, (detalle) => detalle.asiento)
  detalles: DetalleAsiento[];
}
