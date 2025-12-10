import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Gestion } from '../gestion/gestion.entity';
import { Usuario } from '../usuario/usuario.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Entity('asiento') // Tabla: asiento
export class Asiento {
  @PrimaryGeneratedColumn()
  id_asiento: number; // PK

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ length: 100 })
  numero_comprobante: string;

  @Column({ type: 'text' })
  glosa: string;

  @Column({ length: 20 })
  tipo_asiento: string; // Ej: 'Ingreso', 'Egreso', 'Traspaso'

  @Column({ length: 20, default: 'valido' })
  estado: string; // valido, anulado, revertido

  // Tipos de Cambio capturados en el momento del registro
  @Column({ type: 'decimal', precision: 18, scale: 6 })
  tipo_cambio_usd: number;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  tipo_cambio_ufv: number;

  // --- CLAVES FORÁNEAS DE CONTEXTO ---

  // 1. Muchos a Uno con Empresa
  @ManyToOne(() => Empresa, (empresa: Empresa) => empresa.asientos)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  // 2. Muchos a Uno con Gestión
  @ManyToOne(() => Gestion, (gestion: Gestion) => gestion.asientos)
  @JoinColumn({ name: 'id_gestion' })
  gestion: Gestion;

  // --- CLAVES DE AUDITORÍA Y REFERENCIA ---

  @Column({ type: 'timestamp' })
  created_at: Date;

  // 3. Muchos a Uno con Usuario (created_by)
  @ManyToOne(() => Usuario, (usuario: Usuario) => usuario.asientosCreados)
  @JoinColumn({ name: 'created_by' })
  createdBy: Usuario;

  // 4. Relación Recursiva: Reversión
  // Muchos a Uno (Asiento que fue revertido)
  @ManyToOne(() => Asiento, (asiento: Asiento) => asiento.revertidos, {
    nullable: true,
  })
  @JoinColumn({ name: 'reversion_de' })
  reversionDe: Asiento; // El asiento al que este revierte

  // Uno a Muchos (Asientos que revierten a este)
  @OneToMany(() => Asiento, (asiento: Asiento) => asiento.reversionDe)
  revertidos: Asiento[];

  // --- RELACIÓN UNO A MUCHOS (Líneas) ---

  // Un Asiento tiene MUCHAS líneas de detalle
  @OneToMany(() => DetalleAsiento, (detalle: DetalleAsiento) => detalle.asiento)
  detalles: DetalleAsiento[];
}
