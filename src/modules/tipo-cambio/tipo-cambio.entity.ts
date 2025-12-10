import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Moneda } from '../moneda/moneda.entity';

@Entity('tipo_cambio') // Tabla: tipo_cambio
export class TipoCambio {
  @PrimaryGeneratedColumn()
  id_tipo_cambio: number; // PK

  @Column({ type: 'date' })
  fecha: Date; // La fecha en que aplica este tipo de cambio

  // Valores de Tipo de Cambio, usando precisión alta (10, 6)
  @Column({ type: 'decimal', precision: 10, scale: 6 })
  valor_compra: number; // Tipo de cambio para la compra

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  valor_venta: number; // Tipo de cambio para la venta

  // --- RELACIÓN: Muchos a Uno con Moneda (FK: id_moneda_destino) ---
  @ManyToOne(() => Moneda, (moneda: Moneda) => moneda.tiposCambioDestino)
  @JoinColumn({ name: 'id_moneda_destino' }) // Apunta a la moneda cuyo TC se está registrando
  monedaDestino: Moneda;
}
