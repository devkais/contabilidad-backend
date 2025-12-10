import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioEmpresa } from '../usuario-empresa/usuario-empresa.entity'; // Importamos la tabla pivote

@Entity('rol') // Tabla: rol
export class Rol {
  @PrimaryGeneratedColumn('increment')
  id_rol: number; // PK

  @Column({ length: 100 })
  nombre_rol: string;

  // RELACIÓN: Uno a Muchos (Un Rol se usa en muchas asignaciones Usuario-Empresa)
  // Esta relación enlaza el rol con la tabla que define el acceso del usuario a una empresa.
  @OneToMany(() => UsuarioEmpresa, (usuarioEmpresa) => usuarioEmpresa.rol)
  usuarioEmpresas: UsuarioEmpresa[];
}
