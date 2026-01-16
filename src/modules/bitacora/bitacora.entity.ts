import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Empresa } from '../empresa/empresa.entity';

@Entity('bitacora')
export class Bitacora {
  @PrimaryGeneratedColumn()
  id_bitacora: number;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_hora: Date;

  @Column({ name: 'id_usuario', type: 'int', nullable: false })
  id_usuario: number;

  @Column({ name: 'id_empresa', type: 'int', nullable: false })
  id_empresa: number;

  @Column({ length: 20, nullable: false })
  accion: string; // INSERT, UPDATE, DELETE, ANULAR, IMPORT

  @Column({ length: 50, nullable: false })
  modulo_origen: string; // CONTABILIDAD, VENTAS_API, etc.

  @Column({ length: 50, nullable: false })
  tabla_afectada: string;

  @Column({ type: 'int', nullable: false })
  id_registro_afectado: number;

  @Column({ type: 'json', nullable: true })
  detalle_cambio: Record<string, unknown>; // Mapeo explícito en lugar de any

  @Column({ length: 50, nullable: true })
  ip_maquina: string;

  // --- RELACIONES ---

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}
