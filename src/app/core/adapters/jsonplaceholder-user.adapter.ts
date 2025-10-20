import { User } from '../models/user';
import { JsonplaceholderUserDto } from '../../features/user-management/models/jsonplaceholder-user';
import { BaseAdapter } from './base.adapter';

/**
 * Adaptador para JSONPlaceholder API.
 * Esta API no provee avatares ni fechas de registro.
 */
export class JsonplaceholderUserAdapter extends BaseAdapter {
  private static readonly ADAPTER_NAME = 'JsonplaceholderUserAdapter';
  private static readonly DEFAULT_AVATAR = 'default-avatar.svg';

  static adapt(dto: JsonplaceholderUserDto): User {
    // 🛡️ Validar campos requeridos
    this.requireField(dto, 'dto', this.ADAPTER_NAME);
    this.requireField(dto.id, 'id', this.ADAPTER_NAME);
    this.requireField(dto.name, 'name', this.ADAPTER_NAME);
    this.requireField(dto.email, 'email', this.ADAPTER_NAME);

    return {
      id: dto.id,
      name: this.resolveName(dto.name),
      email: this.resolveEmail(dto.email),
      avatar: this.DEFAULT_AVATAR,
      source: 'jsonplaceholder',
    };
  }

  /**
   * Sanitiza el nombre
   */
  private static resolveName(name: string): string {
    const sanitizedName: string = this.sanitizeText(name, 100);

    if (sanitizedName === '') {
      throw new Error(`[${this.ADAPTER_NAME}] Name cannot be empty: ${name}`);
    }

    return sanitizedName;
  }

  /**
   * Valída y normaliza el email
   */
  private static resolveEmail(email: string): string {
    if (!this.isValidEmail(email)) {
      throw new Error(`[${this.ADAPTER_NAME}] Invalid email format: ${email}`);
    }

    return this.normalizeEmail(email);
  }
}
