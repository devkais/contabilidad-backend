import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Asiento } from '../asiento/asiento.entity'; // Necesaria para la relación

@Entity('tipo_asiento')
export class TipoAsiento {
  @PrimaryGeneratedColumn()
  id_tipo_asiento: number; // PK

  @Column({ length: 50, unique: true })
  nombre: string; // Ejemplo: 'Manual', 'Ajuste', 'Cierre'

  @Column({ type: 'boolean', default: false })
  es_ajuste: boolean; // Bandera para indicar si este tipo de asiento es usado para ajustes

  // RELACIÓN con Asiento (Cabecera)
  // Un Tipo de Asiento tiene muchos Asientos asociados
  @OneToMany(() => Asiento, (asiento) => asiento.tipoAsiento)
  asientos: Asiento[];
}
