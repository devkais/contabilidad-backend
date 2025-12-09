import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Rol } from '../rol/rol.entity'; // Necesitamos importar la entidad Rol
import { Asiento } from '../asiento/asiento.entity'; // Necesitamos Asiento para la relación (la crearemos luego)

@Entity('usuario') // Nombre de la tabla en la base de datos
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number; // PK (Primary Key)

  @Column({ length: 255 })
  nombre: string;

  // Otras columnas necesarias que se ven en el diagrama (ej. email, contraseña hasheada, etc.)
  // @Column({ unique: true })
  // email: string;

  // --- RELACIÓN: Muchos a Uno con Rol ---
  // Un Usuario tiene UN Rol
  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  // Define la columna FK en la tabla 'usuario' que apuntará a 'rol'
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;
  // Nota: TypeORM automáticamente manejará la columna 'id_rol' como la FK.

  // --- RELACIÓN: Uno a Muchos con Asiento ---
  // Un Usuario puede crear muchos Asientos
  @OneToMany(() => Asiento, (asiento) => asiento.usuario)
  asientos: Asiento[];
}
