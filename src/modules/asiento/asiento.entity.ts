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
import { TipoAsiento } from '../tipo-asiento/tipo-asiento.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity'; // Para la relación de líneas

@Entity('asiento')
export class Asiento {
  @PrimaryGeneratedColumn()
  id_asiento: number; // PK

  @Column({ type: 'date' })
  fecha: Date; // Fecha en que se registra el asiento

  @Column({ unique: true })
  numero_asiento: number; // Correlativo por gestión o empresa

  @Column({ length: 50 })
  estado: string; // Ejemplo: 'Borrador', 'Registrado', 'Contabilizado'

  // --- CLAVES FORÁNEAS (FKs) ---

  // Muchos a Uno con Empresa
  @ManyToOne(() => Empresa, (empresa) => empresa.asientos)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  // Muchos a Uno con Gestión
  @ManyToOne(() => Gestion, (gestion) => gestion.asientos)
  @JoinColumn({ name: 'id_gestion' })
  gestion: Gestion;

  // Muchos a Uno con Usuario (quién lo creó)
  @ManyToOne(() => Usuario, (usuario) => usuario.asientos)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // Muchos a Uno con TipoAsiento
  @ManyToOne(() => TipoAsiento, (tipoAsiento) => tipoAsiento.asientos)
  @JoinColumn({ name: 'id_tipo_asiento' })
  tipoAsiento: TipoAsiento;

  // --- RELACIÓN UNO A MUCHOS (Líneas) ---

  // Un Asiento tiene MUCHAS líneas de detalle
  @OneToMany(() => DetalleAsiento, (detalle) => detalle.asiento)
  detalles: DetalleAsiento[];
}
