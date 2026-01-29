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
  @PrimaryGeneratedColumn({ name: 'id_bitacora' })
  id_bitacora: number;

  @Column({ name: 'id_usuario', type: 'int', nullable: false })
  id_usuario: number;

  @Column({ name: 'id_empresa', type: 'int', nullable: false })
  id_empresa: number;

  @Column({ length: 50, nullable: false })
  accion: string; // INSERT, UPDATE, DELETE, LOGIN

  @Column({ name: 'modulo_origen', length: 50, nullable: false })
  modulo_origen: string; // ASIENTOS, CUENTAS, etc.

  @Column({ name: 'tabla_afectada', length: 50, nullable: false })
  tabla_afectada: string;

  @Column({ name: 'id_registro_afectado', type: 'int', nullable: false })
  id_registro_afectado: number;

  @CreateDateColumn({ name: 'fecha_hora', type: 'timestamp' })
  fecha_hora: Date;

  @Column({ name: 'ip_maquina', length: 50, nullable: true })
  ip_maquina: string;

  @Column({ name: 'detalle_cambio', type: 'json', nullable: true })
  detalle_cambio: any; // Aquí guardamos el objeto con los cambios

  // RELACIONES
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}
