import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asiento } from '../asiento/asiento.entity'; // Se usará en Asiento

@Entity('gestion')
export class Gestion {
  @PrimaryGeneratedColumn()
  id_gestion: number; // PK

  @Column()
  año: number;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  // RELACIÓN con Asiento (Cabecera)
  // Una Gestión tiene muchos Asientos
  @OneToMany(() => Asiento, (asiento) => asiento.gestion)
  asientos: Asiento[];
}
