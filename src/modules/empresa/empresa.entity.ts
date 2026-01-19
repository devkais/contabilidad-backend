import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Gestion } from '../gestion/gestion.entity';
import { DetalleAsiento } from '../detalle-asiento/detalle-asiento.entity';
import { Cuenta } from '../cuenta/cuenta.entity';
import { Asiento } from '../asiento/asiento.entity';
import { CentroCosto } from '../centro-costo/centro-costo.entity';
import { CuentaAuxiliar } from '../cuenta-auxiliar/cuenta-auxiliar.entity';
import { UsuarioEmpresa } from '../usuario-empresa/usuario-empresa.entity';

@Entity('empresa')
export class Empresa {
  @PrimaryGeneratedColumn()
  id_empresa: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ length: 90, unique: true, nullable: false })
  nit: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ length: 50, nullable: true })
  telefono: string;

  // Relaciones según DBML
  @OneToMany(() => Gestion, (gestion) => gestion.empresa)
  gestiones: Gestion[];

  @OneToMany(() => DetalleAsiento, (detalle) => detalle.empresa)
  detallesAsiento: DetalleAsiento[];

  @OneToMany(() => Cuenta, (cuenta) => cuenta.empresa)
  cuentas: Cuenta[];

  @OneToMany(() => Asiento, (asiento) => asiento.empresa)
  asientos: Asiento[];

  @OneToMany(() => CentroCosto, (cc) => cc.empresa)
  centros_costo: CentroCosto[];

  @OneToMany(() => CuentaAuxiliar, (aux) => aux.empresa)
  cuentas_auxiliares: CuentaAuxiliar[];

  @OneToMany(() => UsuarioEmpresa, (ue) => ue.empresa)
  usuarioEmpresas: UsuarioEmpresa[];
}
