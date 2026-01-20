export class CuentaAuxiliarDto {
  id_cuenta_auxiliar: number;
  codigo: string;
  nombre: string;
  id_empresa: number;
  id_padre: number | null;
  nivel: number;
  activo: boolean;
}
