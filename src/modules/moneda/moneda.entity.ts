import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TipoCambio } from '../tipo-cambio/tipo-cambio.entity';
import { Cuenta } from '../cuenta/cuenta.entity';

@Entity('moneda') // Tabla: moneda
export class Moneda {
  @PrimaryGeneratedColumn()
  id_moneda: number; // PK

  @Column({ length: 10, unique: true })
  codigo: string; // Ejemplo: BS, USD, UFV

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 5 })
  simbolo: string; // Ejemplo: $ o Bs

  // --- RELACIONES UNO A MUCHOS (OneToMany) ---

  // 1. Relación con TipoCambio
  // Una Moneda puede ser destino en muchos Tipos de Cambio registrados
  @OneToMany(
    () => TipoCambio,
    (tipoCambio: TipoCambio) => tipoCambio.monedaDestino,
  )
  tiposCambioDestino: TipoCambio[];

  // 2. Relación con Cuenta
  // Una Moneda es la moneda principal de muchas cuentas
  @OneToMany(() => Cuenta, (cuenta: Cuenta) => cuenta.moneda)
  cuentas: Cuenta[];
}
