import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioEmpresa } from '../usuario-empresa/usuario-empresa.entity';
import { Asiento } from '../asiento/asiento.entity';
import { Bitacora } from '../bitacora/bitacora.entity';

@Entity('usuario') // Tabla: usuario
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number; // PK

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  contrasena_hash: string; // Nuevo: Almacena el hash de la contraseña

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // --- RELACIONES ---

  // 1. Relación con tabla pivote (N:M con Empresa y Rol)
  // Un Usuario puede estar asociado a muchas combinaciones Empresa-Rol
  @OneToMany(() => UsuarioEmpresa, (usuarioEmpresa) => usuarioEmpresa.usuario)
  usuarioEmpresas: UsuarioEmpresa[];

  // 2. Relación con Asiento (Auditoría: created_by)
  // Un Usuario puede crear muchos Asientos
  @OneToMany(() => Asiento, (asiento) => asiento.createdBy)
  asientosCreados: Asiento[];

  // 3. Relación con Bitacora (Auditoría)
  // Un Usuario genera muchas entradas de Bitacora
  @OneToMany(() => Bitacora, (bitacora) => bitacora.usuario)
  bitacoras: Bitacora[];
}
