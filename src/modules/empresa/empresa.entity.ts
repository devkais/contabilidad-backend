import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Gestion } from '../gestion/gestion.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Entity('empresa')
export class Empresa {
  @PrimaryGeneratedColumn()
  id_empresa: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ length: 90, unique: true, nullable: false })
  nit: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ length: 50, nullable: true })
  telefono: string;

  // Relaciones según DBML
  @OneToMany(() => Gestion, (gestion) => gestion.empresa)
  gestiones: Gestion[];

  @OneToMany(() => DetalleAsiento, (detalle) => detalle.empresa)
  detallesAsiento: DetalleAsiento[];
}
