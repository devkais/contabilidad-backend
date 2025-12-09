import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity'; // Importamos Usuario para la relación

@Entity('rol') // Nombre de la tabla en la base de datos
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol: number; // PK (Primary Key)

  @Column({ length: 100, unique: true })
  nombre_rol: string;

  // RELACIÓN: Uno a Muchos (Un Rol tiene muchos Usuarios)
  // El segundo parámetro (usuario => usuario.rol) es la propiedad en la entidad Usuario
  // que hace referencia a esta entidad Rol (la FK `id_rol` en la tabla usuario).
  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];
}
