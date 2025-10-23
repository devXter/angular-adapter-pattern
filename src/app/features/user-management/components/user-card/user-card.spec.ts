import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserCard } from './user-card';
import { User } from '../../../../core/models/user';
import { By } from '@angular/platform-browser';

describe('UserCard', () => {
  let component: UserCard;
  let fixture: ComponentFixture<UserCard>;

  // Test user data for different sources
  const createTestUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'test-avatar.png',
    joinedDate: new Date('2024-01-01'),
    source: 'github',
    ...overrides,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCard],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCard);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      // Arrange & Act
      const testUser = createTestUser();
      fixture.componentRef.setInput('user', testUser);
      fixture.detectChanges();

      // Assert
      expect(component).toBeTruthy();
    });

    it('should initialize with required user InputSignal', () => {
      // Arrange & Act
      const testUser = createTestUser({ name: 'John Doe' });
      fixture.componentRef.setInput('user', testUser);
      fixture.detectChanges();

      // Assert
      expect(component.user()).toEqual(testUser);
      expect(component.user().name).toBe('John Doe');
    });
  });

  describe('InputSignal Reactivity', () => {
    it('should update when user input signal changes', () => {
      // Arrange
      const initialUser = createTestUser({ name: 'Initial User', source: 'github' });
      fixture.componentRef.setInput('user', initialUser);
      fixture.detectChanges();

      // Act
      const updatedUser = createTestUser({ name: 'Updated User', source: 'twitter' });
      fixture.componentRef.setInput('user', updatedUser);
      fixture.detectChanges();

      // Assert
      expect(component.user().name).toBe('Updated User');
      expect(component.user().source).toBe('twitter');
    });

    it('should reflect signal changes in component methods', () => {
      // Arrange
      const githubUser = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', githubUser);
      fixture.detectChanges();
      const githubIcon = component['getSourceIcon']();

      // Act
      const internalUser = createTestUser({ source: 'internal' });
      fixture.componentRef.setInput('user', internalUser);
      fixture.detectChanges();
      const internalIcon = component['getSourceIcon']();

      // Assert
      expect(githubIcon).toBe('🟣');
      expect(internalIcon).toBe('🔵');
      expect(githubIcon).not.toBe(internalIcon);
    });
  });

  describe('getSourceBadgeColor()', () => {
    it('should return badge color for github source', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceBadgeColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return badge color for internal source', () => {
      // Arrange
      const user = createTestUser({ source: 'internal' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceBadgeColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return badge color for jsonplaceholder source', () => {
      // Arrange
      const user = createTestUser({ source: 'jsonplaceholder' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceBadgeColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return badge color for twitter source', () => {
      // Arrange
      const user = createTestUser({ source: 'twitter' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceBadgeColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getSourceBorderColor()', () => {
    it('should return border color for github source', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceBorderColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return border color for internal source', () => {
      // Arrange
      const user = createTestUser({ source: 'internal' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceBorderColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return border color for jsonplaceholder source', () => {
      // Arrange
      const user = createTestUser({ source: 'jsonplaceholder' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceBorderColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return border color for twitter source', () => {
      // Arrange
      const user = createTestUser({ source: 'twitter' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceBorderColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getSourceGradient()', () => {
    it('should return gradient for github source', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceGradient']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return gradient for internal source', () => {
      // Arrange
      const user = createTestUser({ source: 'internal' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceGradient']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return gradient for jsonplaceholder source', () => {
      // Arrange
      const user = createTestUser({ source: 'jsonplaceholder' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceGradient']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return gradient for twitter source', () => {
      // Arrange
      const user = createTestUser({ source: 'twitter' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceGradient']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getSourceRingColor()', () => {
    it('should return ring color for github source', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceRingColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return ring color for internal source', () => {
      // Arrange
      const user = createTestUser({ source: 'internal' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceRingColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return ring color for jsonplaceholder source', () => {
      // Arrange
      const user = createTestUser({ source: 'jsonplaceholder' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceRingColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return ring color for twitter source', () => {
      // Arrange
      const user = createTestUser({ source: 'twitter' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceRingColor']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getSourceIconBg()', () => {
    it('should return icon background for github source', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceIconBg']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return icon background for internal source', () => {
      // Arrange
      const user = createTestUser({ source: 'internal' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceIconBg']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return icon background for jsonplaceholder source', () => {
      // Arrange
      const user = createTestUser({ source: 'jsonplaceholder' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceIconBg']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return icon background for twitter source', () => {
      // Arrange
      const user = createTestUser({ source: 'twitter' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceIconBg']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getSourceLightBg()', () => {
    it('should return light background for github source', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceLightBg']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return light background for internal source', () => {
      // Arrange
      const user = createTestUser({ source: 'internal' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceLightBg']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return light background for jsonplaceholder source', () => {
      // Arrange
      const user = createTestUser({ source: 'jsonplaceholder' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceLightBg']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return light background for twitter source', () => {
      // Arrange
      const user = createTestUser({ source: 'twitter' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceLightBg']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getSourceFooter()', () => {
    it('should return footer styling for github source', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceFooter']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return footer styling for internal source', () => {
      // Arrange
      const user = createTestUser({ source: 'internal' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceFooter']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return footer styling for jsonplaceholder source', () => {
      // Arrange
      const user = createTestUser({ source: 'jsonplaceholder' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceFooter']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return footer styling for twitter source', () => {
      // Arrange
      const user = createTestUser({ source: 'twitter' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceFooter']();

      // Assert
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getSourceIcon()', () => {
    it('should return correct icon for github source', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceIcon']();

      // Assert
      expect(result).toBe('🟣');
    });

    it('should return correct icon for internal source', () => {
      // Arrange
      const user = createTestUser({ source: 'internal' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceIcon']();

      // Assert
      expect(result).toBe('🔵');
    });

    it('should return correct icon for jsonplaceholder source', () => {
      // Arrange
      const user = createTestUser({ source: 'jsonplaceholder' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceIcon']();

      // Assert
      expect(result).toBe('🟢');
    });

    it('should return correct icon for twitter source', () => {
      // Arrange
      const user = createTestUser({ source: 'twitter' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const result = component['getSourceIcon']();

      // Assert
      expect(result).toBe('🔵');
    });
  });

  describe('Template Rendering - User Data Display', () => {
    it('should render user name in the template', () => {
      // Arrange
      const user = createTestUser({ name: 'Alice Johnson' });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const nameElement = compiled.querySelector('h3');

      // Assert
      expect(nameElement).toBeTruthy();
      expect(nameElement?.textContent).toContain('Alice Johnson');
    });

    it('should render user email in the template', () => {
      // Arrange
      const user = createTestUser({ email: 'alice@example.com' });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const emailLink = compiled.querySelector('a[href^="mailto:"]');

      // Assert
      expect(emailLink).toBeTruthy();
      expect(emailLink?.textContent?.trim()).toBe('alice@example.com');
      expect(emailLink?.getAttribute('href')).toBe('mailto:alice@example.com');
    });

    it('should render user avatar with correct src', () => {
      // Arrange
      const user = createTestUser({ avatar: 'avatar-url.png', name: 'Bob Smith' });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const avatarImage = compiled.querySelector('img') as HTMLImageElement;

      // Assert
      expect(avatarImage).toBeTruthy();
      // NgOptimizedImage directive processes the image
      expect(avatarImage?.getAttribute('alt')).toBe('Bob Smith');
      // Verify the image element exists and has proper attributes
      expect(avatarImage?.hasAttribute('width')).toBe(true);
      expect(avatarImage?.hasAttribute('height')).toBe(true);
    });

    it('should display source badge with correct source name', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const badges = compiled.querySelectorAll('span');
      const sourceBadge = Array.from(badges).find((span) =>
        span.textContent?.trim().toLowerCase().includes('github')
      );

      // Assert
      expect(sourceBadge).toBeTruthy();
      expect(sourceBadge?.textContent?.trim()).toBe('github');
    });

    it('should display source icon in the template', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Assert - check that the icon emoji is rendered somewhere in the template
      expect(compiled.textContent).toContain('🟣');
    });

    it('should display titlecase source name in footer', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const footerDiv = compiled.querySelector('div[class*="border-t"]');

      // Assert
      expect(footerDiv).toBeTruthy();
      expect(footerDiv?.textContent).toContain('Github'); // TitleCase pipe
    });
  });

  describe('JoinedDate Handling', () => {
    it('should display formatted date when joinedDate is a valid Date', () => {
      // Arrange
      const testDate = new Date('2024-06-15');
      const user = createTestUser({ joinedDate: testDate });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Assert - date should be formatted by DatePipe
      expect(compiled.textContent).toContain('Ingresó:');
      expect(compiled.textContent).toContain('Jun'); // Part of mediumDate format
    });

    it('should display "not available" message when joinedDate is null', () => {
      // Arrange
      const user = createTestUser({ joinedDate: null });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Assert
      expect(compiled.textContent).toContain('Fecha de ingreso no disponible');
    });

    it('should display "not available" message when joinedDate is undefined', () => {
      // Arrange
      const user = createTestUser({ joinedDate: undefined });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Assert
      expect(compiled.textContent).toContain('Fecha de ingreso no disponible');
    });

    it('should handle different date values correctly', () => {
      // Arrange - use dates with time component to avoid timezone issues
      const user1 = createTestUser({ joinedDate: new Date('2020-06-15T12:00:00') });
      const user2 = createTestUser({ joinedDate: new Date('2023-08-20T12:00:00') });
      fixture.componentRef.setInput('user', user1);
      fixture.detectChanges();
      const content1 = fixture.nativeElement.textContent;

      // Act
      fixture.componentRef.setInput('user', user2);
      fixture.detectChanges();
      const content2 = fixture.nativeElement.textContent;

      // Assert - dates should be different
      expect(content1).not.toBe(content2);
      // Check for date parts that are less prone to timezone issues
      expect(content1).toContain('Jun');
      expect(content2).toContain('Aug');
    });
  });

  describe('Edge Cases and Different Source Types', () => {
    it('should handle user with minimal data (no joinedDate)', () => {
      // Arrange
      const user = createTestUser({ joinedDate: undefined });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.user()).toEqual(user);
      expect(fixture.nativeElement.textContent).toContain('Fecha de ingreso no disponible');
    });

    it('should correctly render user from internal source', () => {
      // Arrange
      const user = createTestUser({ source: 'internal', name: 'Internal User' });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Assert
      expect(compiled.textContent).toContain('Internal User');
      expect(compiled.textContent).toContain('internal');
      expect(component['getSourceIcon']()).toBe('🔵');
    });

    it('should correctly render user from jsonplaceholder source', () => {
      // Arrange
      const user = createTestUser({ source: 'jsonplaceholder', name: 'JSON User' });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Assert
      expect(compiled.textContent).toContain('JSON User');
      expect(compiled.textContent).toContain('jsonplaceholder');
      expect(component['getSourceIcon']()).toBe('🟢');
    });

    it('should correctly render user from twitter source', () => {
      // Arrange
      const user = createTestUser({ source: 'twitter', name: 'Twitter User' });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Assert
      expect(compiled.textContent).toContain('Twitter User');
      expect(compiled.textContent).toContain('twitter');
      expect(component['getSourceIcon']()).toBe('🔵');
    });

    it('should handle special characters in user name', () => {
      // Arrange
      const user = createTestUser({ name: "O'Brien-Smith Jr." });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Assert
      expect(compiled.textContent).toContain("O'Brien-Smith Jr.");
    });

    it('should handle special characters in email', () => {
      // Arrange
      const user = createTestUser({ email: 'user+tag@example.com' });
      fixture.componentRef.setInput('user', user);

      // Act
      fixture.detectChanges();
      const emailLink = fixture.nativeElement.querySelector('a[href^="mailto:"]');

      // Assert
      expect(emailLink?.getAttribute('href')).toBe('mailto:user+tag@example.com');
    });
  });

  describe('Method Return Value Consistency', () => {
    it('should return different values for different sources in getSourceBadgeColor', () => {
      // Arrange
      const githubUser = createTestUser({ source: 'github' });
      const internalUser = createTestUser({ source: 'internal' });

      // Act
      fixture.componentRef.setInput('user', githubUser);
      fixture.detectChanges();
      const githubResult = component['getSourceBadgeColor']();

      fixture.componentRef.setInput('user', internalUser);
      fixture.detectChanges();
      const internalResult = component['getSourceBadgeColor']();

      // Assert
      expect(githubResult).not.toBe(internalResult);
    });

    it('should return different values for different sources in getSourceGradient', () => {
      // Arrange
      const jsonplaceholderUser = createTestUser({ source: 'jsonplaceholder' });
      const twitterUser = createTestUser({ source: 'twitter' });

      // Act
      fixture.componentRef.setInput('user', jsonplaceholderUser);
      fixture.detectChanges();
      const jsonplaceholderResult = component['getSourceGradient']();

      fixture.componentRef.setInput('user', twitterUser);
      fixture.detectChanges();
      const twitterResult = component['getSourceGradient']();

      // Assert
      expect(jsonplaceholderResult).not.toBe(twitterResult);
    });

    it('should return consistent values for same source across multiple calls', () => {
      // Arrange
      const user = createTestUser({ source: 'github' });
      fixture.componentRef.setInput('user', user);
      fixture.detectChanges();

      // Act
      const call1 = component['getSourceIcon']();
      const call2 = component['getSourceIcon']();
      const call3 = component['getSourceIcon']();

      // Assert
      expect(call1).toBe(call2);
      expect(call2).toBe(call3);
      expect(call1).toBe('🟣');
    });
  });

  describe('Zoneless Change Detection', () => {
    it('should render correctly with explicit change detection', () => {
      // Arrange
      const user = createTestUser({ name: 'Zoneless User' });

      // Act - set input without calling detectChanges first
      fixture.componentRef.setInput('user', user);
      // Template should not render yet without detectChanges
      let compiled = fixture.nativeElement as HTMLElement;
      const beforeDetection = compiled.querySelector('h3')?.textContent;

      // Now trigger change detection explicitly
      fixture.detectChanges();
      compiled = fixture.nativeElement as HTMLElement;
      const afterDetection = compiled.querySelector('h3')?.textContent;

      // Assert - content should be visible after detectChanges
      expect(afterDetection).toContain('Zoneless User');
    });

    it('should update template when signal changes with explicit detectChanges', () => {
      // Arrange
      const user1 = createTestUser({ name: 'First User' });
      fixture.componentRef.setInput('user', user1);
      fixture.detectChanges();

      // Act
      const user2 = createTestUser({ name: 'Second User' });
      fixture.componentRef.setInput('user', user2);
      // Explicitly call detectChanges for zoneless mode
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Assert
      expect(compiled.textContent).toContain('Second User');
      expect(compiled.textContent).not.toContain('First User');
    });
  });
});
