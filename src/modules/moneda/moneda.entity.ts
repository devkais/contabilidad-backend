import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TipoCambio } from '../tipo-cambio/tipo-cambio.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';

@Entity('moneda')
export class Moneda {
  @PrimaryGeneratedColumn()
  id_moneda: number; // PK

  @Column({ length: 5, unique: true })
  codigo: string; // Ejemplo: USD, BOB, EUR

  @Column({ length: 100 })
  nombre: string; // Ejemplo: Dólar Americano, Boliviano

  // RELACIÓN con TipoCambio
  // Una Moneda tiene muchos Tipos de Cambio registrados
  @OneToMany(() => TipoCambio, (tipoCambio) => tipoCambio.moneda)
  tiposCambio: TipoCambio[];

  // RELACIÓN con DetalleAsiento
  // Una Moneda se usa en muchas líneas de Detalle de Asiento
  @OneToMany(() => DetalleAsiento, (detalle) => detalle.moneda)
  detallesAsiento: DetalleAsiento[];
}
