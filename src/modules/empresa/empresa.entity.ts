import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Gestion } from '../gestion/gestion.entity';
import { UsuarioEmpresa } from '../usuario-empresa/usuario-empresa.entity';
import { Cuenta } from '../cuenta/cuenta.entity';
import { CentroCosto } from '../centro-costo/centro-costo.entity';
import { CuentaAuxiliar } from '../cuenta-auxiliar/cuenta-auxiliar.entity';
import { Asiento } from '../asiento/asiento.entity';
import { Bitacora } from '../bitacora/bitacora.entity';

@Entity('empresa') // Tabla: empresa
export class Empresa {
  @PrimaryGeneratedColumn()
  id_empresa: number; // PK

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 90, unique: true })
  nit: string;

  // Nuevos Campos
  @Column({ length: 255 })
  direccion: string;

  @Column({ length: 50 })
  telefono: string;

  @Column({ default: true })
  activo: boolean;

  // --- RELACIONES UNO A MUCHOS (OneToMany) ---

  // 1. Relación con Gestion
  @OneToMany(() => Gestion, (gestion) => gestion.empresa)
  gestiones: Gestion[];

  // 2. Relación con la tabla pivote UsuarioEmpresa
  @OneToMany(() => UsuarioEmpresa, (usuarioEmpresa) => usuarioEmpresa.empresa)
  usuarioEmpresas: UsuarioEmpresa[];

  // 3. Relación con Cuenta (Plan de Cuentas)
  @OneToMany(() => Cuenta, (cuenta) => cuenta.empresa)
  cuentas: Cuenta[];

  // 4. Relación con CentroCosto
  @OneToMany(() => CentroCosto, (centroCosto) => centroCosto.empresa)
  centrosCosto: CentroCosto[];

  // 5. Relación con CuentaAuxiliar
  @OneToMany(() => CuentaAuxiliar, (cuentaAuxiliar) => cuentaAuxiliar.empresa)
  cuentasAuxiliares: CuentaAuxiliar[];

  // 6. Relación con Asiento
  @OneToMany(() => Asiento, (asiento) => asiento.empresa)
  asientos: Asiento[];

  // 7. Relación con Bitacora
  @OneToMany(() => Bitacora, (bitacora) => bitacora.empresa)
  bitacoras: Bitacora[];
}
