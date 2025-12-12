// src/detalle-asiento/dto/create-detalle-asiento.dto.ts

export class CreateDetalleAsientoDto {
  // --- MOVIMIENTOS CONTABLES (Obligatorios para la lógica, pueden ser cero) ---
  tipo_mov_debe_haber_bs: number;
  tipo_mov_debe_haber_usd: number;
  tipo_mov_debe_haber_ufv: number;
  // --- LLAVES FORÁNEAS OBLIGATORIAS ---
  id_asiento: number;
  id_cuenta: number;
  // --- LLAVES FORÁNEAS OPCIONALES ---
  id_cuenta_auxiliar?: number | null;
  id_centro_costo?: number | null;
}
