// src/modules/cuentas/dto/cuenta.dto.ts

// Usamos interfaces o clases para definir la estructura de la respuesta
export class CuentaDto {
  id_cuenta: number;
  codigo: string;
  nombre: string;
  nivel: number;
  clase_cuenta: string;
  activo: boolean;
  es_movimiento: boolean;

  // FKs (Se devuelven solo los IDs o los objetos relacionados si se cargan)
  id_cuenta_padre?: number | null;
  id_empresa: number;
  id_gestion: number;
  id_moneda: number;

  // Si incluyes la relación en el GET, se vería así:
  // padre?: CuentaDto;
  // empresa?: any; // Objeto Empresa simplificado
}
