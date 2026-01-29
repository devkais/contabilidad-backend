export class MathUtil {
  // Para montos en registros (Libros, Balances)
  static roundMoney(value: number | string): number {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    // Usamos el factor de precisión para evitar errores de coma flotante de JS
    return Number(Math.round(Number(num + 'e2')) + 'e-2');
  }

  // Para tipos de cambio (Bolivia exige 6 decimales para TC oficial)
  static roundExchangeRate(value: number | string): number {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return Number(Math.round(Number(num + 'e6')) + 'e-6');
  }

  static isBalanced(debe: number, haber: number): boolean {
    // En contabilidad empresarial, la diferencia debe ser CERO absoluto tras redondear
    const diff = Math.abs(this.roundMoney(debe) - this.roundMoney(haber));
    return diff < 0.001; // Margen menor a un centavo
  }

  static convert(monto: number, tc: number): number {
    // Calculamos con toda la precisión y solo redondeamos al final para el guardado
    return this.roundMoney(monto * tc);
  }
}
