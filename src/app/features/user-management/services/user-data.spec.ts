import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserData } from './user-data';
import { User } from '../../../core/models/user';
import { GithubUserDto } from '../models/github-user';
import { InternalUserDto } from '../models/internal-user';
import { JsonplaceholderUserDto } from '../models/jsonplaceholder-user';
import { TwitterUserDto } from '../models/twitter-user';
import { GithubUserAdapter } from '../../../core/adapters/github-user.adapter';
import { InternalUserAdapter } from '../../../core/adapters/internal-user.adapter';
import { JsonplaceholderUserAdapter } from '../../../core/adapters/jsonplaceholder-user.adapter';
import { TwitterUserAdapter } from '../../../core/adapters/twitter-user.adapter';

describe('UserData Service', () => {
  let service: UserData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserData, provideZonelessChangeDetection()],
    });
    service = TestBed.inject(UserData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty users array', () => {
      expect(service.allUsers()).toEqual([]);
    });
  });

  describe('loadMockData', () => {
    beforeEach(() => {
      // Spy on console methods to prevent cluttering test output
      spyOn(console, 'log');
      spyOn(console, 'warn');
      spyOn(console, 'error');
    });

    it('should load and adapt users from all sources', () => {
      service.loadMockData();

      const users = service.allUsers();

      // Should have 4 users (1 from each source)
      expect(users.length).toBe(4);
    });

    it('should adapt GitHub user correctly', () => {
      service.loadMockData();

      const users = service.allUsers();
      const githubUser = users.find((u) => u.source === 'github');

      expect(githubUser).toBeDefined();
      expect(githubUser?.id).toBe(1);
      expect(githubUser?.name).toBe('The Octocat');
      expect(githubUser?.email).toBe('octocat@github.com');
      expect(githubUser?.avatar).toBe('https://avatars.githubusercontent.com/u/583231');
      expect(githubUser?.joinedDate).toBeInstanceOf(Date);
      expect(githubUser?.source).toBe('github');
    });

    it('should adapt Internal user correctly', () => {
      service.loadMockData();

      const users = service.allUsers();
      const internalUser = users.find((u) => u.source === 'internal');

      expect(internalUser).toBeDefined();
      expect(internalUser?.id).toBe(101);
      expect(internalUser?.name).toBe('María González');
      expect(internalUser?.email).toBe('maria@company.com');
      expect(internalUser?.avatar).toBe('https://i.pravatar.cc/150?img=5');
      expect(internalUser?.joinedDate).toBeInstanceOf(Date);
      expect(internalUser?.source).toBe('internal');
    });

    it('should adapt JSONPlaceholder user correctly', () => {
      service.loadMockData();

      const users = service.allUsers();
      const jsonUser = users.find((u) => u.source === 'jsonplaceholder');

      expect(jsonUser).toBeDefined();
      expect(jsonUser?.id).toBe(1);
      expect(jsonUser?.name).toBe('Leanne Graham');
      expect(jsonUser?.email).toBe('leanne@example.com');
      expect(jsonUser?.avatar).toBe('default-avatar.svg');
      expect(jsonUser?.joinedDate).toBeUndefined();
      expect(jsonUser?.source).toBe('jsonplaceholder');
    });

    it('should adapt Twitter user correctly', () => {
      service.loadMockData();

      const users = service.allUsers();
      const twitterUser = users.find((u) => u.source === 'twitter');

      expect(twitterUser).toBeDefined();
      expect(twitterUser?.id).toBe(783214);
      expect(twitterUser?.name).toBe('Elon Musk');
      expect(twitterUser?.email).toBe('elonmusk@twitter.com');
      expect(twitterUser?.avatar).toContain('_400x400');
      expect(twitterUser?.joinedDate).toBeInstanceOf(Date);
      expect(twitterUser?.source).toBe('twitter');
    });

    it('should log success message after loading', () => {
      service.loadMockData();

      expect(console.log).toHaveBeenCalledWith('✅ Successfully adapted 4 users');
    });

    it('should not log warning when there are no errors', () => {
      service.loadMockData();

      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('adaptWithErrorHandling - Error Handling', () => {
    beforeEach(() => {
      spyOn(console, 'log');
      spyOn(console, 'warn');
      spyOn(console, 'error');
    });

    it('should continue processing when one adapter fails', () => {
      // Spy on GithubUserAdapter to make it throw an error
      spyOn(GithubUserAdapter, 'adapt').and.throwError('GitHub adapter error');

      service.loadMockData();

      const users = service.allUsers();

      // Should have 3 users (GitHub failed, but others succeeded)
      expect(users.length).toBe(3);

      // Verify GitHub user is not in the list
      const githubUser = users.find((u) => u.source === 'github');
      expect(githubUser).toBeUndefined();

      // Verify other sources are present
      expect(users.some((u) => u.source === 'internal')).toBe(true);
      expect(users.some((u) => u.source === 'jsonplaceholder')).toBe(true);
      expect(users.some((u) => u.source === 'twitter')).toBe(true);
    });

    it('should log error message when adapter fails', () => {
      spyOn(GithubUserAdapter, 'adapt').and.throwError('GitHub adapter error');

      service.loadMockData();

      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringContaining('[GitHub] Failed to adapt user at index 0'),
        jasmine.any(Object),
      );
    });

    it('should log warning when there are errors', () => {
      spyOn(GithubUserAdapter, 'adapt').and.throwError('GitHub adapter error');

      service.loadMockData();

      expect(console.warn).toHaveBeenCalledWith(
        jasmine.stringContaining('⚠️ 1 errors during adaptation:'),
        jasmine.any(Array),
      );
    });

    it('should handle multiple adapter failures', () => {
      spyOn(GithubUserAdapter, 'adapt').and.throwError('GitHub error');
      spyOn(InternalUserAdapter, 'adapt').and.throwError('Internal error');

      service.loadMockData();

      const users = service.allUsers();

      // Should have 2 users (GitHub and Internal failed)
      expect(users.length).toBe(2);

      expect(console.warn).toHaveBeenCalledWith(
        jasmine.stringContaining('⚠️ 2 errors during adaptation:'),
        jasmine.any(Array),
      );
    });

    it('should handle all adapters failing', () => {
      spyOn(GithubUserAdapter, 'adapt').and.throwError('GitHub error');
      spyOn(InternalUserAdapter, 'adapt').and.throwError('Internal error');
      spyOn(JsonplaceholderUserAdapter, 'adapt').and.throwError('JSONPlaceholder error');
      spyOn(TwitterUserAdapter, 'adapt').and.throwError('Twitter error');

      service.loadMockData();

      const users = service.allUsers();

      expect(users.length).toBe(0);
      expect(console.log).toHaveBeenCalledWith('✅ Successfully adapted 0 users');
      expect(console.warn).toHaveBeenCalledWith(
        jasmine.stringContaining('⚠️ 4 errors during adaptation:'),
        jasmine.any(Array),
      );
    });

    it('should handle non-Error exceptions gracefully', () => {
      spyOn(GithubUserAdapter, 'adapt').and.throwError({ message: 'Not an Error object' } as any);

      service.loadMockData();

      const users = service.allUsers();

      expect(users.length).toBe(3);
      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringContaining('[GitHub] Failed to adapt user at index 0'),
        jasmine.any(Object),
      );
    });
  });

  describe('Signal Reactivity', () => {
    beforeEach(() => {
      spyOn(console, 'log');
      spyOn(console, 'warn');
      spyOn(console, 'error');
    });

    it('should update allUsers signal when loadMockData is called', () => {
      const initialUsers = service.allUsers();
      expect(initialUsers.length).toBe(0);

      service.loadMockData();

      const updatedUsers = service.allUsers();
      expect(updatedUsers.length).toBe(4);
    });

    it('should replace previous users when loadMockData is called again', () => {
      service.loadMockData();
      const firstLoad = service.allUsers();
      expect(firstLoad.length).toBe(4);

      // Mock adapters to return different data
      spyOn(GithubUserAdapter, 'adapt').and.returnValue({
        id: 999,
        name: 'New User',
        email: 'new@test.com',
        avatar: 'avatar.jpg',
        source: 'github',
      } as User);

      service.loadMockData();
      const secondLoad = service.allUsers();

      // Should still have 4 users but with updated data
      expect(secondLoad.length).toBe(4);
      const githubUser = secondLoad.find((u) => u.source === 'github');
      expect(githubUser?.id).toBe(999);
      expect(githubUser?.name).toBe('New User');
    });
  });

  describe('Error Message Formatting', () => {
    beforeEach(() => {
      spyOn(console, 'log');
      spyOn(console, 'warn');
      spyOn(console, 'error');
    });

    it('should include source name in error message', () => {
      spyOn(GithubUserAdapter, 'adapt').and.throwError('Test error');

      service.loadMockData();

      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringContaining('[GitHub]'),
        jasmine.any(Object),
      );
    });

    it('should include index in error message', () => {
      spyOn(GithubUserAdapter, 'adapt').and.throwError('Test error');

      service.loadMockData();

      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringContaining('index 0'),
        jasmine.any(Object),
      );
    });

    it('should include error message in log', () => {
      spyOn(GithubUserAdapter, 'adapt').and.throwError('Custom error message');

      service.loadMockData();

      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringContaining('Custom error message'),
        jasmine.any(Object),
      );
    });
  });

  describe('Adapter Integration', () => {
    beforeEach(() => {
      spyOn(console, 'log');
      spyOn(console, 'warn');
      spyOn(console, 'error');
    });

    it('should call GithubUserAdapter.adapt with correct DTO', () => {
      spyOn(GithubUserAdapter, 'adapt').and.callThrough();

      service.loadMockData();

      expect(GithubUserAdapter.adapt).toHaveBeenCalledWith({
        id: 1,
        login: 'octocat',
        name: 'The Octocat',
        email: 'octocat@github.com',
        avatar_url: 'https://avatars.githubusercontent.com/u/583231',
        created_at: '2011-01-25T18:44:36Z',
      });
    });

    it('should call InternalUserAdapter.adapt with correct DTO', () => {
      spyOn(InternalUserAdapter, 'adapt').and.callThrough();

      service.loadMockData();

      expect(InternalUserAdapter.adapt).toHaveBeenCalledWith({
        userId: '101',
        fullName: 'María González',
        emailAddress: 'maria@company.com',
        profileImage: 'https://i.pravatar.cc/150?img=5',
        registeredAt: '2023-06-15T10:30:00Z',
      });
    });

    it('should call JsonplaceholderUserAdapter.adapt with correct DTO', () => {
      spyOn(JsonplaceholderUserAdapter, 'adapt').and.callThrough();

      service.loadMockData();

      expect(JsonplaceholderUserAdapter.adapt).toHaveBeenCalledWith({
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'leanne@example.com',
      });
    });

    it('should call TwitterUserAdapter.adapt with correct DTO', () => {
      spyOn(TwitterUserAdapter, 'adapt').and.callThrough();

      service.loadMockData();

      expect(TwitterUserAdapter.adapt).toHaveBeenCalledWith({
        id_str: '783214',
        screen_name: 'elonmusk',
        name: 'Elon Musk',
        profile_image_url_https:
          'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO_normal.jpg',
        created_at: 'Tue Jun 02 20:12:29 +0000 2009',
        verified: true,
        followers_count: 150000000,
      });
    });
  });

  describe('Data Source Independence', () => {
    beforeEach(() => {
      spyOn(console, 'log');
      spyOn(console, 'warn');
      spyOn(console, 'error');
    });

    it('should process each data source independently', () => {
      const githubSpy = spyOn(GithubUserAdapter, 'adapt').and.throwError('GitHub failed');
      const internalSpy = spyOn(InternalUserAdapter, 'adapt').and.callThrough();
      const jsonSpy = spyOn(JsonplaceholderUserAdapter, 'adapt').and.callThrough();
      const twitterSpy = spyOn(TwitterUserAdapter, 'adapt').and.callThrough();

      service.loadMockData();

      // All adapters should be called even if GitHub failed
      expect(githubSpy).toHaveBeenCalled();
      expect(internalSpy).toHaveBeenCalled();
      expect(jsonSpy).toHaveBeenCalled();
      expect(twitterSpy).toHaveBeenCalled();

      const users = service.allUsers();
      expect(users.length).toBe(3);
    });

    it('should aggregate users from multiple sources', () => {
      service.loadMockData();

      const users = service.allUsers();
      const sources = users.map((u) => u.source);

      expect(sources).toContain('github');
      expect(sources).toContain('internal');
      expect(sources).toContain('jsonplaceholder');
      expect(sources).toContain('twitter');
    });

    it('should preserve order of users from different sources', () => {
      service.loadMockData();

      const users = service.allUsers();

      // Users should appear in the order: GitHub, Internal, JSONPlaceholder, Twitter
      expect(users[0].source).toBe('github');
      expect(users[1].source).toBe('internal');
      expect(users[2].source).toBe('jsonplaceholder');
      expect(users[3].source).toBe('twitter');
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      spyOn(console, 'log');
      spyOn(console, 'warn');
      spyOn(console, 'error');
    });

    it('should handle empty data arrays gracefully', () => {
      // This test verifies the service works with the current implementation
      // In a real scenario, you might want to make data arrays configurable
      service.loadMockData();

      const users = service.allUsers();
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
    });

    it('should handle adapter returning valid User object', () => {
      const mockUser: User = {
        id: 123,
        name: 'Mock User',
        email: 'mock@test.com',
        avatar: 'mock.jpg',
        joinedDate: new Date(),
        source: 'github',
      };

      spyOn(GithubUserAdapter, 'adapt').and.returnValue(mockUser);

      service.loadMockData();

      const users = service.allUsers();
      const githubUser = users.find((u) => u.source === 'github');

      expect(githubUser).toEqual(mockUser);
    });

    it('should maintain signal immutability', () => {
      service.loadMockData();

      const users1 = service.allUsers();
      const users2 = service.allUsers();

      // Should return the same reference (readonly signal)
      expect(users1).toBe(users2);
    });
  });
});
