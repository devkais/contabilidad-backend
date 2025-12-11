export class UpdateBitacoraDto {
  id_bitacora?: number;
  id_usuario?: number;
  id_empresa?: number;
  accion?: string;
  tabla_afectada?: string;
  id_registro_afectado?: number;
  fecha_hora?: Date;
  ip_maquina?: string;
  detalle_cambio?: string;
}
