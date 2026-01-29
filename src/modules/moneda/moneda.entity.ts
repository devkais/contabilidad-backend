import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cuenta } from '../cuenta/cuenta.entity';

@Entity('moneda')
export class Moneda {
  @PrimaryGeneratedColumn()
  id_moneda: number;

  @Column({ length: 10, unique: true, nullable: false })
  codigo: string; // Ejemplo: BOB, USD, UFV

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ length: 5, nullable: false })
  simbolo: string;

  // Relaciones según DBML

  @OneToMany(() => Cuenta, (cuenta) => cuenta.moneda)
  cuentas: Cuenta[];
}
