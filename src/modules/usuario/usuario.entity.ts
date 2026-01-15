import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asiento } from '../asiento/asiento.entity';
import { Bitacora } from '../bitacora/bitacora.entity';

import { Exclude } from 'class-transformer';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Exclude()
  @Column({ length: 255 })
  password: string;

  @Column({ name: 'nombre_completo', length: 100, nullable: true })
  nombre_completo: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // --- RELACIONES ---
  @OneToMany(() => Asiento, (asiento) => asiento.created_by)
  asientosCreados: Asiento[];

  @OneToMany(() => Bitacora, (bitacora) => bitacora.usuario)
  bitacoras: Bitacora[];

  // --- COMPATIBILIDAD (DEPRECADO) ---
}
