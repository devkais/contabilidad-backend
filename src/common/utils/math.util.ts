export class MathUtil {
  /**
   * Redondea montos de dinero (BS/SUS) a 2 decimales exactos.
   * Utilizado para DEBE, HABER y saldos de cuentas.
   */
  static roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  /**
   * Redondea tipos de cambio a 6 decimales exactos.
   * Ajustado a la definición del DBML: decimal(18, 6).
   */
  static roundExchangeRate(value: number): number {
    const factor = 1_000_000;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  /**
   * Verifica la doble partida (Diferencia mínima aceptable).
   * Compara que la suma de Debes y Haberes sea igual.
   */
  static isBalanced(debe: number, haber: number): boolean {
    // Usamos una constante de error pequeña para evitar problemas de precisión
    return Math.abs(this.roundMoney(debe) - this.roundMoney(haber)) < 0.01;
  }

  /**
   * Calcula la conversión de moneda con la precisión requerida.
   * @param monto Monto en moneda origen
   * @param tc Tipo de cambio (6 decimales)
   */
  static convert(monto: number, tc: number): number {
    const resultado = monto * tc;
    return this.roundMoney(resultado);
  }
}
