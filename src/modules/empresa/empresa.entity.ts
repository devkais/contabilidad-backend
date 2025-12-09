import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asiento } from '../asiento/asiento.entity'; // Se usará en Asiento

@Entity('empresa')
export class Empresa {
  @PrimaryGeneratedColumn()
  id_empresa: number; // PK

  @Column({ length: 255, unique: true })
  nombre: string;

  @Column({ length: 50, unique: true })
  nit: string;

  // RELACIÓN con Asiento (Cabecera)
  // Una Empresa tiene muchos Asientos
  @OneToMany(() => Asiento, (asiento) => asiento.empresa)
  asientos: Asiento[];
}
