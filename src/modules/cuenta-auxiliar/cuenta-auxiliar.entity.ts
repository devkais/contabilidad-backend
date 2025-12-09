import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Entity('cuenta_auxiliar') // Tabla: cuenta_auxiliar
export class CuentaAuxiliar {
  @PrimaryGeneratedColumn()
  id_cuenta_auxiliar: number; // PK

  @Column({ length: 50 })
  codigo: string;

  @Column({ length: 255 })
  nombre: string; // Ejemplo: 'Té', 'Café', 'Almuerzo de Empleados'

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // --- FK: id_empresa ---
  // Muchos a Uno con Empresa
  @ManyToOne(() => Empresa, (empresa: Empresa) => empresa.cuentasAuxiliares)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  // --- RELACIÓN con DetalleAsiento ---
  // Uno a Muchos: Una Cuenta Auxiliar puede tener muchos Detalles de Asiento asociados
  @OneToMany(
    () => DetalleAsiento,
    (detalle: DetalleAsiento) => detalle.cuentaAuxiliar,
  )
  detallesAsiento: DetalleAsiento[];
}
