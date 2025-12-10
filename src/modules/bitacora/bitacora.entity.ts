import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Empresa } from '../empresa/empresa.entity';

@Entity('bitacora') // Tabla: bitacora
export class Bitacora {
  @PrimaryGeneratedColumn('increment')
  id_bitacora: number; // PK

  @Column({ length: 50 })
  accion: string; // Ejemplo: 'CREAR_ASIENTO', 'MODIFICAR_CUENTA', 'CERRAR_GESTION'

  @Column({ length: 50 })
  tabla_afectada: string; // Ejemplo: 'asiento', 'cuenta'

  @Column()
  id_registro_afectado: number; // PK del registro afectado en la otra tabla

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_hora: Date; // Timestamp del evento

  @Column({ length: 50 })
  ip_maquina: string; // IP del cliente que realizó la acción

  @Column({ type: 'text' })
  detalle_cambio: string; // JSON o texto que describe los valores cambiados

  // --- FK: id_usuario ---
  @ManyToOne(() => Usuario, (usuario: Usuario) => usuario.bitacoras)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // --- FK: id_empresa ---
  @ManyToOne(() => Empresa, (empresa: Empresa) => empresa.bitacoras)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}
