import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Asiento } from '../asiento/asiento.entity';
import { Cuenta } from '../cuenta/cuenta.entity';
import { Moneda } from '../moneda/moneda.entity';

@Entity('detalle_asiento')
export class DetalleAsiento {
  @PrimaryGeneratedColumn()
  id_detalle: number; // PK

  // Monto. Utiliza decimal para precisión monetaria (DECIMAL 18,2 según tu diagrama)
  @Column({ type: 'decimal', precision: 18, scale: 2 })
  monto: number;

  @Column({ length: 10 })
  tipo_movimiento: string; // 'Debe' o 'Haber' (Clave para la Partida Doble)

  @Column({ type: 'varchar', length: 255, nullable: true })
  glosa_linea: string; // Glosa opcional para el detalle

  // --- CLAVES FORÁNEAS (FKs) ---

  // Muchos a Uno con Asiento (Cabecera)
  @ManyToOne(() => Asiento, (asiento) => asiento.detalles)
  @JoinColumn({ name: 'id_asiento' })
  asiento: Asiento;

  // Muchos a Uno con Cuenta (Plan de Cuentas)
  @ManyToOne(() => Cuenta, (cuenta) => cuenta.detallesAsiento)
  @JoinColumn({ name: 'id_cuenta' })
  cuenta: Cuenta;

  // Muchos a Uno con Moneda
  @ManyToOne(() => Moneda, (moneda) => moneda.detallesAsiento)
  @JoinColumn({ name: 'id_moneda' })
  moneda: Moneda;
}
