// src/asiento/dto/create-asiento.dto.ts

export class CreateAsientoDto {
  fecha: string;
  numero_comprobante: string;
  glosa: string;
  tipo_asiento: string;
  estado: string; // Aunque tiene default 'valido', lo pedimos para control
  tipo_cambio_usd: number;
  tipo_cambio_ufv: number;
  // --- LLAVES FORÁNEAS OBLIGATORIAS ---
  id_empresa: number;
  id_gestion: number;
  created_by: number;
  // --- LLAVE FORÁNEA RECURSIVA (OPCIONAL) ---
  reversion_de?: number | null;
}
