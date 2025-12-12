// src/detalle-asiento/dto/detalle-asiento.dto.ts

import { CuentaAuxiliarDto } from '../../cuenta-auxiliar/dto/cuenta-auxiliar.dto';
import { CentroCostoDto } from '../../centro-costo/dto/centro-costo.dto';

// DTOs simplificados para evitar recursión innecesaria
class AsientoSimpleDto {
  id_asiento: number;
  fecha: string;
}

class CuentaSimpleDto {
  id_cuenta: number;
  codigo: string;
  nombre: string;
}

export class DetalleAsientoDto {
  id_detalle: number;

  tipo_mov_debe_haber_bs: number;
  tipo_mov_debe_haber_usd: number;
  tipo_mov_debe_haber_ufv: number;

  // --- Relaciones Anidadas ---
  asiento: AsientoSimpleDto;
  cuenta: CuentaSimpleDto;
  cuentaAuxiliar: CuentaAuxiliarDto | null;
  centroCosto: CentroCostoDto | null;
}
