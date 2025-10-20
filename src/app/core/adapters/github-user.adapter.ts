import { GithubUserDto } from '../../features/user-management/models/github-user';
import { User } from '../models/user';
import { BaseAdapter } from './base.adapter';

/**
 * Adaptador para transformar usuarios de GitHub API al modelo interno User.
 * Extiende BaseAdapter para reutilizar métodos de validación.
 */
export class GithubUserAdapter extends BaseAdapter {
  private static readonly ADAPTER_NAME = 'GithubUserAdapter';
  private static readonly DEFAULT_AVATAR = 'default-avatar.svg';

  /**
   * Transforma un GithubUserDto en un User
   *
   * @throws Error si los datos requeridos están ausentes o son inválidos
   */
  static adapt(dto: GithubUserDto): User {
    // 🛡️ Validar campos requeridos
    this.requireField(dto, 'dto', this.ADAPTER_NAME);
    this.requireField(dto.id, 'id', this.ADAPTER_NAME);
    this.requireField(dto.login, 'login', this.ADAPTER_NAME);

    return {
      id: dto.id,
      name: this.resolveName(dto.name, dto.login),
      email: this.resolveEmail(dto.email, dto.login),
      avatar: this.resolveAvatar(dto.avatar_url),
      source: 'github',
    };
  }

  /**
   * Resuelve el nombre: usa 'name' si existe, si no usa 'login'
   */
  private static resolveName(name: string | null, login: string): string {
    const sanitizedName: string = this.sanitizeText(name || '', 100);

    return sanitizedName !== '' ? sanitizedName : login;
  }

  /**
   * Resuelve el email: valída el email o genera uno basado en login
   */
  private static resolveEmail(email: string | null, login: string): string {
    if (email && this.isValidEmail(email)) {
      return this.normalizeEmail(email);
    }

    // Fallback: generar email basado en el username
    return `${login.toLowerCase()}@github.com`;
  }

  /**
   * Resuelve la URL del avatar
   */
  private static resolveAvatar(avatarUrl?: string): string {
    return this.getValueOrDefault(avatarUrl, this.DEFAULT_AVATAR);
  }
}
