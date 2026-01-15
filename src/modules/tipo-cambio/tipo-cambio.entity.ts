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
  id_tipo_cambio: number;

  @Column({ type: 'date', nullable: false })
  fecha: Date;

  @Column({ name: 'id_moneda_destino', type: 'int', nullable: false })
  id_moneda_destino: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: false })
  oficial: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  venta: number;

  @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
  compra: number;

  // Relación según DBML
  @ManyToOne(() => Moneda, (moneda) => moneda.tiposCambio)
  @JoinColumn({ name: 'id_moneda_destino' })
  monedaDestino: Moneda;
}
