import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Moneda } from '../moneda/moneda.entity';

@Entity('tipo_cambio')
export class TipoCambio {
  @PrimaryGeneratedColumn()
  id_tipo_cambio: number; // PK

  @Column({ type: 'date' })
  fecha: Date; // La fecha en que aplica este tipo de cambio

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  valor: number; // El valor del tipo de cambio (ej: 6.96 Bs por 1 USD)

  // --- RELACIÓN: Muchos a Uno con Moneda ---
  // Este tipo de cambio se refiere a UNA Moneda
  @ManyToOne(() => Moneda, (moneda) => moneda.tiposCambio)
  @JoinColumn({ name: 'id_moneda' }) // La FK que apunta a la Moneda
  moneda: Moneda;
}
