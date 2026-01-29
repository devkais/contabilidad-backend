import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioEmpresaGestion } from '../usuario-empresa-gestion/usuario-empresa-gestion.entity';
import { Asiento } from '../asiento/asiento.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ length: 100, unique: true }) // Cambiado de email a username
  username: string;

  @Column({ name: 'contrasena_hash', length: 255, nullable: false })
  contrasenaHash: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // RELACIONES
  @OneToMany(() => UsuarioEmpresaGestion, (ueg) => ueg.usuario)
  accesoGestiones: UsuarioEmpresaGestion[];

  @OneToMany(() => Asiento, (asiento) => asiento.usuario)
  asientosCreados: Asiento[];
}
