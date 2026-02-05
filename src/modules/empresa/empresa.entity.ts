import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Gestion } from '../gestion/gestion.entity';
import { Cuenta } from '../cuenta/cuenta.entity';
import { CentroCosto } from '../centro-costo/centro-costo.entity';
import { CuentaAuxiliar } from '../cuenta-auxiliar/cuenta-auxiliar.entity';
import { UsuarioEmpresaGestion } from '../usuario-empresa-gestion/usuario-empresa-gestion.entity';

@Entity('empresa')
export class Empresa {
  @PrimaryGeneratedColumn({ name: 'id_empresa' })
  id_empresa: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ length: 90, unique: true, nullable: false })
  nit: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ length: 50, nullable: true })
  telefono: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // --- RELACIONES ESTRUCTURALES ---

  @OneToMany(() => Gestion, (gestion) => gestion.empresa)
  gestiones: Gestion[];

  @OneToMany(() => Cuenta, (cuenta) => cuenta.empresa)
  cuentas: Cuenta[];

  @OneToMany(() => CentroCosto, (cc) => cc.empresa)
  centros_costo: CentroCosto[];

  @OneToMany(() => CuentaAuxiliar, (aux) => aux.empresa)
  cuentas_auxiliares: CuentaAuxiliar[];

  @OneToMany(() => UsuarioEmpresaGestion, (ueg) => ueg.empresa)
  usuarioEmpresaGestiones: UsuarioEmpresaGestion[];
}
