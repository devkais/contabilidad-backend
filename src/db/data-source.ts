import { DataSource } from 'typeorm';
import { Empresa } from '../modules/empresa/empresa.entity';
import { Usuario } from '../modules/usuario/usuario.entity';
import { Rol } from '../modules/rol/rol.entity';
import { UsuarioEmpresa } from '../modules/usuario-empresa/usuario-empresa.entity';
import { Gestion } from '../modules/gestion/gestion.entity';
import { Moneda } from '../modules/moneda/moneda.entity';
import { TipoCambio } from '../modules/tipo-cambio/tipo-cambio.entity';
import { Cuenta } from '../modules/cuenta/cuenta.entity';
import { CentroCosto } from '../modules/centro-costo/centro-costo.entity';
import { CuentaAuxiliar } from '../modules/cuenta-auxiliar/cuenta-auxiliar.entity';
import { Asiento } from '../modules/asiento/asiento.entity';
import { DetalleAsiento } from '../modules/detalle-asiento/detalle-asiento.entity';
import { Bitacora } from '../modules/bitacora/bitacora.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'miguel',
  password: 'root',
  database: 'contabilidad_db',
  entities: [
    Empresa,
    Usuario,
    Rol,
    UsuarioEmpresa,
    Gestion,
    Moneda,
    TipoCambio,
    Cuenta,
    CentroCosto,
    CuentaAuxiliar,
    Asiento,
    DetalleAsiento,
    Bitacora,
  ],
  synchronize: true,
  logging: true,
});
