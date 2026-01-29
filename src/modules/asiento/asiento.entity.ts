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
import { Usuario } from '../usuario/usuario.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Entity('asiento')
export class Asiento {
  @PrimaryGeneratedColumn({ name: 'id_asiento' })
  id_asiento: number;

  @Column({ name: 'id_empresa', type: 'int' })
  id_empresa: number;

  @Column({ name: 'id_gestion', type: 'int' })
  id_gestion: number;

  @Column({ name: 'created_by', type: 'int' })
  created_by: number;

  @Column({ name: 'reversion_de', type: 'int', nullable: true })
  reversion_de: number | null;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ name: 'numero_comprobante', length: 100 })
  numero_comprobante: string;

  @Column({ type: 'text' })
  glosa_general: string;

  @Column({ name: 'tipo_asiento', length: 20 })
  tipo_asiento: string; // INGRESO, EGRESO, TRASPASO, AJUSTE

  @Column({ length: 20, default: 'contabilizado' })
  estado: string; // CONTABILIZADO, ANULADO, REVERTIDO

  @Column({
    name: 'tc_oficial_asiento',
    type: 'decimal',
    precision: 18,
    scale: 6,
  })
  tc_oficial_asiento: number;

  @Column({
    name: 'tc_ufv_asiento',
    type: 'decimal',
    precision: 18,
    scale: 6,
    nullable: true,
  })
  tc_ufv_asiento: number;

  @Column({ name: 'sistema_origen', length: 50, default: 'MANUAL' })
  sistema_origen: string;

  // --- RELACIONES ---

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => Gestion)
  @JoinColumn({ name: 'id_gestion' })
  gestion: Gestion;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'created_by' })
  usuario: Usuario;

  @OneToMany(() => DetalleAsiento, (detalle) => detalle.asiento, {
    cascade: true,
  })
  detalles: DetalleAsiento[];

  @ManyToOne(() => Asiento)
  @JoinColumn({ name: 'reversion_de' })
  asientoOriginal: Asiento;
}
