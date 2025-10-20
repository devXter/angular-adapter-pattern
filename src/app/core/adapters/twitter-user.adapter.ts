import { User } from '../models/user';
import { TwitterUserDto } from '../../features/user-management/models/twitter-user';
import { BaseAdapter } from './base.adapter';

export class TwitterUserAdapter extends BaseAdapter {
  private static readonly DEFAULT_AVATAR: string = 'default-avatar.svg';
  private static readonly ADAPTER_NAME: string = 'TwitterUserAdapter';

  static adapt(dto: TwitterUserDto): User {
    // 🛡️ Validar campos requeridos
    this.requireField(dto, 'dto', this.ADAPTER_NAME);
    this.requireField(dto.id_str, 'id_str', this.ADAPTER_NAME);
    this.requireField(dto.screen_name, 'screen_name', this.ADAPTER_NAME);

    return {
      id: this.parseTwitterId(dto.id_str),
      name: this.resolveName(dto.name, dto.screen_name),
      email: this.generateEmail(dto.screen_name),
      avatar: this.resolveAvatar(dto.profile_image_url_https),
      joinedDate: this.parseDateSafely(dto.created_at),
      source: 'twitter',
    };
  }

  /**
   * Convierte el ID de Twitter (string) a number
   */
  private static parseTwitterId(idStr: string): number {
    return this.parseNumber(idStr, 'id_str', this.ADAPTER_NAME);
  }

  /**
   * Resuelve el nombre: usa 'name' o el screen_name como fallback
   */
  private static resolveName(name: string, screenName: string): string {
    const sanitizedName: string = this.sanitizeText(name, 100);

    // Si el nombre está vacío, usa @screenName
    return sanitizedName !== '' ? sanitizedName : `@${screenName}`;
  }

  /**
   * Genera un email ficticio (Twitter no expone emails públicamente)
   */
  private static generateEmail(screenName: string): string {
    return `${screenName.toLowerCase()}@twitter.com`;
  }

  /**
   * Resuelve la URL del avatar, mejorando la calidad de la imagen
   */
  private static resolveAvatar(profileImageUrl?: string): string {
    if (!profileImageUrl || profileImageUrl.trim() === '') {
      return this.DEFAULT_AVATAR;
    }

    // Twitter usa '_normal' para imágenes pequeñas, las cambiamos a '_400x400'
    return profileImageUrl.replace('_normal', '_400x400');
  }
}
