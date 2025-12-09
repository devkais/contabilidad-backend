import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Asiento } from '../asiento/asiento.entity';
import { Cuenta } from '../cuenta/cuenta.entity';

@Entity('gestion') // Tabla: gestion
export class Gestion {
  @PrimaryGeneratedColumn()
  id_gestion: number; // PK

  @Column({ length: 100 })
  nombre: string; // Ejemplo: '2024' o 'Enero 2024'

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  @Column({ length: 20, default: 'abierto' })
  estado: string; // 'abierto', 'cerrado'. Una gestión cerrada previene modificaciones de asientos.

  // --- RELACIÓN: Muchos a Uno con Empresa (FK: id_empresa) ---
  @ManyToOne(() => Empresa, (empresa: Empresa) => empresa.gestiones)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  // --- RELACIONES UNO A MUCHOS (OneToMany) ---

  // 1. Relación con Asiento
  @OneToMany(() => Asiento, (asiento: Asiento) => asiento.gestion)
  asientos: Asiento[];

  // 2. Relación con Cuenta (Permite tener diferentes Planes de Cuentas por Gestión, si se requiere)
  @OneToMany(() => Cuenta, (cuenta: Cuenta) => cuenta.gestion)
  cuentas: Cuenta[];
}
