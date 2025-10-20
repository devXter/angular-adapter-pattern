/**
 * Clase base abstracta con métodos de utilidad para todos los adaptadores.
 *
 * ⚠️ Esta clase NO puede ser instanciada directamente.
 * Solo puede ser extendida por otras clases adaptadoras.
 *
 * 🎯 Propósito: Evitar duplicar código de validación y transformación
 * en todos los adaptadores.
 */
export abstract class BaseAdapter {
  /**
   * Valida que un email tenga formato correcto
   *
   * @example
   * this.isValidEmail('user@example.com') // true
   * this.isValidEmail('invalid-email')    // false
   */
  protected static isValidEmail(email: string): boolean {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Parsea una fecha de forma segura, retornando un fallback si falla
   *
   * @param dateString - String con la fecha a parsear
   * @param fallback - Fecha a retornar si el parseo falla (default: fecha actual)
   *
   * @example
   * this.parseDateSafely('2023-01-15')        // Date(2023-01-15)
   * this.parseDateSafely('invalid-date')      // Date(now)
   * this.parseDateSafely('invalid', null)     // null
   */
  protected static parseDateSafely(
    dateString: string,
    fallback: Date | null = new Date(),
  ): Date | null {
    if (!dateString) return fallback;

    try {
      const date: Date = new Date(dateString);

      // Verifica que la fecha sea válida
      if (isNaN(date.getTime())) {
        console.warn(`[BaseAdapter] Invalid date format: "${dateString}", using fallback`);
        return fallback;
      }

      return date;
    } catch (error) {
      console.error('[BaseAdapter] Error parsing date:', error);
      return fallback;
    }
  }

  /**
   * Sanitiza texto: elimina espacios al inicio/fin y limita longitud
   *
   * @param text - Texto a sanitizar
   * @param maxLength - Longitud máxima opcional
   *
   * @example
   * this.sanitizeText('  John Doe  ')           // 'John Doe'
   * this.sanitizeText('Very Long Name', 10)     // 'Very Long ...'
   */
  protected static sanitizeText(text: string, maxLength?: number): string {
    if (!text) return '';

    const sanitized: string = text.trim();

    if (maxLength && sanitized.length > maxLength) {
      return sanitized.substring(0, maxLength) + '...';
    }

    return sanitized;
  }

  /**
   * Valída que un campo requerido exista y no esté vacío
   *
   * @throws Error si el campo no es válido
   *
   * @example
   * this.requireField(dto.id, 'id', 'GithubUserAdapter')
   * // Si dto.id está vacío → Error: [GithubUserAdapter] Missing required field: id
   */
  protected static requireField(value: any, fieldName: string, adapterName: string): void {
    const isEmpty: boolean =
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (typeof value === 'number' && isNaN(value));

    if (isEmpty) {
      throw new Error(`[${adapterName}] Missing or invalid required field: ${fieldName}`);
    }
  }

  /**
   * Convierte un string a número de forma segura
   *
   * @throws Error si la conversión falla
   *
   * @example
   * this.parseNumber('123', 'userId', 'InternalAdapter')  // 123
   * this.parseNumber('abc', 'userId', 'InternalAdapter')  // Error!
   */
  protected static parseNumber(
    value: string | number,
    fieldName: string,
    adapterName: string,
  ): number {
    const parsed: number = typeof value === 'number' ? value : Number(value);

    if (isNaN(parsed)) {
      throw new Error(`[${adapterName}] Invalid number format for field: ${fieldName}: ${value}`);
    }

    return parsed;
  }

  /**
   * Normaliza un email: lo convierte a minúsculas y elimina espacios
   *
   * @example
   * this.normalizeEmail('  USER@Example.COM  ')  // 'user@example.com'
   */
  protected static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Obtiene un valor o retorna un default si está vacío
   *
   * @example
   * this.getValueOrDefault('', 'default')      // 'default'
   * this.getValueOrDefault('value', 'default') // 'value'
   */
  protected static getValueOrDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return value === null || value === undefined || value === '' ? defaultValue : value;
  }
}
