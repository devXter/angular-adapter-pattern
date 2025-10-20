import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { User } from '../../../core/models/user';
import { GithubUserDto } from '../models/github-user';
import { InternalUserDto } from '../models/internal-user';
import { JsonplaceholderUserDto } from '../models/jsonplaceholder-user';
import { GithubUserAdapter } from '../../../core/adapters/github-user.adapter';
import { InternalUserAdapter } from '../../../core/adapters/internal-user.adapter';
import { JsonplaceholderUserAdapter } from '../../../core/adapters/jsonplaceholder-user.adapter';
import { TwitterUserDto } from '../models/twitter-user';
import { TwitterUserAdapter } from '../../../core/adapters/twitter-user.adapter';
import { UserAdapter } from '../../../core/adapters/user.adapter.interface';

@Injectable()
export class UserData {
  private readonly users: WritableSignal<User[]> = signal<User[]>([]);
  private readonly errors: WritableSignal<string[]> = signal<string[]>([]);

  readonly allUsers: Signal<User[]> = this.users.asReadonly();

  loadMockData(): void {
    // Simular datos de diferentes APIs
    const githubData: GithubUserDto[] = [
      {
        id: 1,
        login: 'octocat',
        name: 'The Octocat',
        email: 'octocat@github.com',
        avatar_url: 'https://avatars.githubusercontent.com/u/583231',
        created_at: '2011-01-25T18:44:36Z',
      },
    ];

    const internalData: InternalUserDto[] = [
      {
        userId: '101',
        fullName: 'María González',
        emailAddress: 'maria@company.com',
        profileImage: 'https://i.pravatar.cc/150?img=5',
        registeredAt: '2023-06-15T10:30:00Z',
      },
    ];

    const jsonPlaceholderData: JsonplaceholderUserDto[] = [
      {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'leanne@example.com',
      },
    ];

    // 🆕 Datos de Twitter
    const twitterData: TwitterUserDto[] = [
      {
        id_str: '783214',
        screen_name: 'elonmusk',
        name: 'Elon Musk',
        profile_image_url_https:
          'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_normal.jpg',
        created_at: 'Tue Jun 02 20:12:29 +0000 2009',
        verified: true,
        followers_count: 150000000,
      },
    ];

    // 🛡️ Adaptar con manejo de errores
    const adaptedUsers: User[] = [];
    const errorList: string[] = [];

    // Adaptar GitHub
    this.adaptWithErrorHandling(githubData, GithubUserAdapter, 'GitHub', adaptedUsers, errorList);

    // Adaptar Internal
    this.adaptWithErrorHandling(
      internalData,
      InternalUserAdapter,
      'Internal',
      adaptedUsers,
      errorList,
    );

    // Adaptar JSONPlaceholder
    this.adaptWithErrorHandling(
      jsonPlaceholderData,
      JsonplaceholderUserAdapter,
      'JSONPlaceholder',
      adaptedUsers,
      errorList,
    );

    // 🆕 Adaptar Twitter
    this.adaptWithErrorHandling(
      twitterData,
      TwitterUserAdapter,
      'Twitter',
      adaptedUsers,
      errorList,
    );

    this.users.set(adaptedUsers);
    this.errors.set(errorList);

    // Log de resultados
    console.log(`✅ Successfully adapted ${adaptedUsers.length} users`);
    if (errorList.length > 0) {
      console.warn(`⚠️ ${errorList.length} errors during adaptation:`, errorList);
    }
  }

  /**
   * 🛡️ Método auxiliar para adaptar con manejo de errores
   */
  private adaptWithErrorHandling<T>(
    data: T[],
    adapter: UserAdapter<T>,
    sourceName: string,
    successList: User[],
    errorList: string[],
  ): void {
    data.forEach((dto: T, index: number): void => {
      try {
        const adaptedUser: User = adapter.adapt(dto);
        successList.push(adaptedUser);
      } catch (error) {
        const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
        const logMessage: string = `[${sourceName}] Failed to adapt user at index ${index}: ${errorMessage}`;
        errorList.push(logMessage);
        console.error(logMessage, dto);
      }
    });
  }
}
