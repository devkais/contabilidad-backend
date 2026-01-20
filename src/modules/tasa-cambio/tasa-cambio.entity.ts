// src/modules/tasa-cambio/tasa-cambio.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('tasa_cambio')
export class TasaCambio {
  @PrimaryGeneratedColumn()
  id_tasa: number;

  @Column({ type: 'date', unique: true })
  fecha: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  cotizacion_usd: number;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  cotizacion_ufv: number;

  @CreateDateColumn()
  created_at: Date;
}
