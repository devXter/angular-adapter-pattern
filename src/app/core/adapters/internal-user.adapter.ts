import { InternalUserDto } from '../../features/user-management/models/internal-user';
import { User } from '../models/user';
import { BaseAdapter } from './base.adapter';

/**
 * Adaptador para transformar usuarios de la API interna al modelo User.
 */
export class InternalUserAdapter extends BaseAdapter {
  private static readonly ADAPTER_NAME = 'InternalUserAdapter';
  private static readonly DEFAULT_AVATAR = 'default-avatar.svg';

  static adapt(dto: InternalUserDto): User {
    // 🛡️ Validar campos requeridos
    this.requireField(dto, 'dto', this.ADAPTER_NAME);
    this.requireField(dto.userId, 'userId', this.ADAPTER_NAME);
    this.requireField(dto.fullName, 'fullName', this.ADAPTER_NAME);
    this.requireField(dto.emailAddress, 'emailAddress', this.ADAPTER_NAME);

    return {
      id: this.parseUserId(dto.userId),
      name: this.resolveName(dto.fullName),
      email: this.resolveEmail(dto.emailAddress),
      avatar: this.resolveAvatar(dto.profileImage),
      joinedDate: this.parseRegistrationDate(dto.registeredAt),
      source: 'internal',
    };
  }

  /**
   * Convierte userId de string a number
   */
  private static parseUserId(userId: string): number {
    const parsed: number = this.parseNumber(userId, 'userId', this.ADAPTER_NAME);

    if (parsed <= 0) {
      throw new Error(`[${this.ADAPTER_NAME}] userId must be positive: ${userId}`);
    }

    return parsed;
  }

  /**
   * Sanitiza el nombre completo
   */
  private static resolveName(fullName: string): string {
    const sanitizedName: string = this.sanitizeText(fullName, 150);

    if (sanitizedName === '') {
      throw new Error(
        `[${this.ADAPTER_NAME}] fullName cannot be empty after sanitization: ${fullName}`,
      );
    }

    return sanitizedName;
  }

  /**
   * Valída y normaliza el email
   */
  private static resolveEmail(emailAddress: string): string {
    if (!this.isValidEmail(emailAddress)) {
      throw new Error(`[${this.ADAPTER_NAME}] Invalid email format: ${emailAddress}`);
    }

    return this.normalizeEmail(emailAddress);
  }

  /**
   * Resuelve la imagen de perfil
   */
  private static resolveAvatar(profileImage?: string): string {
    return this.getValueOrDefault(profileImage, this.DEFAULT_AVATAR);
  }

  /**
   * Parsea la fecha de registro con validación adicional
   */
  private static parseRegistrationDate(registeredAt: string): Date | null {
    const date: Date | null = this.parseDateSafely(registeredAt);

    // Validar que la fecha no sea futura
    if (date && date > new Date()) {
      console.warn(`[${this.ADAPTER_NAME}] Future registration date detected, using current date`);
      return new Date();
    }

    return date;
  }
}
