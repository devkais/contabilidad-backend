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
  @PrimaryGeneratedColumn({ name: 'id_tipo_cambio' })
  id_tipo_cambio: number;

  @Column({ type: 'date', nullable: false })
  fecha: Date;

  @Column({ name: 'id_moneda_destino', type: 'int', nullable: false })
  id_moneda_destino: number; // Generalmente el ID del Dólar

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: false })
  oficial: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  venta: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  compra: number;

  // RELACIONES
  @ManyToOne(() => Moneda)
  @JoinColumn({ name: 'id_moneda_destino' })
  moneda: Moneda;
}
