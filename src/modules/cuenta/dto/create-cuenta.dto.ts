// src/modules/cuentas/dto/create-cuenta.dto.ts
// NOTA: No incluimos id_cuenta, ya que es la PK y se autogenera.
export class CreateCuentaDto {
  codigo: string;
  nombre: string;
  nivel: number;
  id_cuenta_padre?: number | null; // Opcional para cuentas de nivel 1
  id_empresa: number; // FK obligatoria
  id_gestion: number; // FK obligatoria
  id_moneda: number; // FK obligatoria
  clase_cuenta: string;
  activo: boolean = true;
  es_movimiento: boolean; // CLAVE: True si es cuenta de último nivel
}
