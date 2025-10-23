import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Header } from './header';
import { User } from '../../../../core/models/user';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  /**
   * Helper function to create mock users for testing
   */
  const createMockUsers = (count: number): User[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      avatar: `avatar${index + 1}.png`,
      joinedDate: new Date(),
      source: 'github' as const,
    }));
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      // Arrange & Act
      fixture = TestBed.createComponent(Header);
      fixture.componentRef.setInput('users', []);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert
      expect(component).toBeTruthy();
    });

    it('should be a standalone component', () => {
      // Arrange & Act
      fixture = TestBed.createComponent(Header);
      fixture.componentRef.setInput('users', []);
      component = fixture.componentInstance;

      // Assert
      expect(component).toBeDefined();
      expect(fixture.componentRef.instance).toBeInstanceOf(Header);
    });

    it('should have the correct selector in metadata', () => {
      // Arrange & Act
      fixture = TestBed.createComponent(Header);
      fixture.componentRef.setInput('users', []);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert
      // Verify the component has the expected header element
      const headerElement = fixture.nativeElement.querySelector('header');
      expect(headerElement).toBeTruthy();
    });
  });

  describe('InputSignal - users', () => {
    it('should accept users input signal', () => {
      // Arrange
      const mockUsers = createMockUsers(3);
      fixture = TestBed.createComponent(Header);

      // Act
      fixture.componentRef.setInput('users', mockUsers);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert
      expect(component.users()).toEqual(mockUsers);
    });

    it('should be reactive to users input changes', () => {
      // Arrange
      const initialUsers = createMockUsers(2);
      const updatedUsers = createMockUsers(5);
      fixture = TestBed.createComponent(Header);
      fixture.componentRef.setInput('users', initialUsers);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act
      fixture.componentRef.setInput('users', updatedUsers);
      fixture.detectChanges();

      // Assert
      expect(component.users()).toEqual(updatedUsers);
      expect(component.users().length).toBe(5);
    });

    it('should handle empty users array', () => {
      // Arrange
      const emptyUsers: User[] = [];
      fixture = TestBed.createComponent(Header);

      // Act
      fixture.componentRef.setInput('users', emptyUsers);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert
      expect(component.users()).toEqual([]);
      expect(component.users().length).toBe(0);
    });

    it('should handle single user in array', () => {
      // Arrange
      const singleUser = createMockUsers(1);
      fixture = TestBed.createComponent(Header);

      // Act
      fixture.componentRef.setInput('users', singleUser);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert
      expect(component.users()).toEqual(singleUser);
      expect(component.users().length).toBe(1);
    });

    it('should handle multiple users in array', () => {
      // Arrange
      const multipleUsers = createMockUsers(10);
      fixture = TestBed.createComponent(Header);

      // Act
      fixture.componentRef.setInput('users', multipleUsers);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Assert
      expect(component.users()).toEqual(multipleUsers);
      expect(component.users().length).toBe(10);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(Header);
    });

    it('should render the header element', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const headerElement = fixture.nativeElement.querySelector('header');
      expect(headerElement).toBeTruthy();
    });

    it('should render the main title "Patrón Adapter"', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const h1Element = fixture.nativeElement.querySelector('h1');
      expect(h1Element).toBeTruthy();
      expect(h1Element.textContent).toContain('Patrón Adapter');
    });

    it('should render the subtitle "Dashboard de usuarios"', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const h1Element = fixture.nativeElement.querySelector('h1');
      const spanElement = h1Element?.querySelector('span');
      expect(spanElement).toBeTruthy();
      expect(spanElement?.textContent).toContain('Dashboard de usuarios');
    });

    it('should render the description text', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const pElement = fixture.nativeElement.querySelector('p.max-w-2xl');
      expect(pElement).toBeTruthy();
      expect(pElement.textContent).toContain('Múltiples fuentes de datos adaptadas a un modelo unificado');
    });

    it('should render the "Design Pattern" badge', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const badgeElements = fixture.nativeElement.querySelectorAll('span');
      const designPatternBadge = Array.from(badgeElements).find((span) =>
        (span as HTMLElement).textContent?.trim() === 'Design Pattern'
      );
      expect(designPatternBadge).toBeTruthy();
    });

    it('should render the "Angular 20+" badge', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const spanElements = fixture.nativeElement.querySelectorAll('span');
      const angularBadge = Array.from(spanElements).find((span) =>
        (span as HTMLElement).textContent?.trim() === 'Angular 20+'
      );
      expect(angularBadge).toBeTruthy();
    });

    it('should render the emoji icon', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const divElements = fixture.nativeElement.querySelectorAll('div');
      const emojiDiv = Array.from(divElements).find((div) =>
        (div as HTMLElement).textContent?.trim() === '🔌'
      );
      expect(emojiDiv).toBeTruthy();
    });
  });

  describe('Statistics Section', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(Header);
    });

    it('should render the statistics grid', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const statsGrid = fixture.nativeElement.querySelector('.grid.grid-cols-3');
      expect(statsGrid).toBeTruthy();
    });

    it('should display correct user count with empty array', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement).toBeTruthy();
      expect(userCountElement.textContent.trim()).toBe('0');
    });

    it('should display correct user count with single user', () => {
      // Arrange
      const singleUser = createMockUsers(1);
      fixture.componentRef.setInput('users', singleUser);

      // Act
      fixture.detectChanges();

      // Assert
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement).toBeTruthy();
      expect(userCountElement.textContent.trim()).toBe('1');
    });

    it('should display correct user count with multiple users', () => {
      // Arrange
      const multipleUsers = createMockUsers(25);
      fixture.componentRef.setInput('users', multipleUsers);

      // Act
      fixture.detectChanges();

      // Assert
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement).toBeTruthy();
      expect(userCountElement.textContent.trim()).toBe('25');
    });

    it('should update user count when users input changes', () => {
      // Arrange
      fixture.componentRef.setInput('users', createMockUsers(5));
      fixture.detectChanges();
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement.textContent.trim()).toBe('5');

      // Act
      fixture.componentRef.setInput('users', createMockUsers(15));
      fixture.detectChanges();

      // Assert
      expect(userCountElement.textContent.trim()).toBe('15');
    });

    it('should display "Usuarios" label for user count', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const labels = fixture.nativeElement.querySelectorAll('.text-gray-600');
      const usuariosLabel = Array.from(labels).find((label) =>
        (label as HTMLElement).textContent?.trim() === 'Usuarios'
      );
      expect(usuariosLabel).toBeTruthy();
    });

    it('should display static "4" for sources count', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const sourcesCountElement = fixture.nativeElement.querySelector('.text-purple-600');
      expect(sourcesCountElement).toBeTruthy();
      expect(sourcesCountElement.textContent.trim()).toBe('4');
    });

    it('should display "Fuentes" label for sources count', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const labels = fixture.nativeElement.querySelectorAll('.text-gray-600');
      const fuentesLabel = Array.from(labels).find((label) =>
        (label as HTMLElement).textContent?.trim() === 'Fuentes'
      );
      expect(fuentesLabel).toBeTruthy();
    });

    it('should display static "100%" for adaptation percentage', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const adaptedPercentElement = fixture.nativeElement.querySelector('.text-green-600');
      expect(adaptedPercentElement).toBeTruthy();
      expect(adaptedPercentElement.textContent.trim()).toBe('100%');
    });

    it('should display "Adaptado" label for adaptation percentage', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const labels = fixture.nativeElement.querySelectorAll('.text-gray-600');
      const adaptadoLabel = Array.from(labels).find((label) =>
        (label as HTMLElement).textContent?.trim() === 'Adaptado'
      );
      expect(adaptadoLabel).toBeTruthy();
    });

    it('should have three statistics columns', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);

      // Act
      fixture.detectChanges();

      // Assert
      const columns = fixture.nativeElement.querySelectorAll('.grid-cols-3 > div');
      expect(columns.length).toBe(3);
    });
  });

  describe('DOM Structure', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(Header);
      fixture.componentRef.setInput('users', []);
      fixture.detectChanges();
    });

    it('should have correct header structure', () => {
      // Assert
      const header = fixture.nativeElement.querySelector('header');
      expect(header).toBeTruthy();
      expect(header.classList.contains('mb-6')).toBe(true);
      expect(header.classList.contains('rounded-lg')).toBe(true);
    });

    it('should have gradient background classes on header', () => {
      // Assert
      const header = fixture.nativeElement.querySelector('header');
      expect(header.classList.contains('bg-gradient-to-r')).toBe(true);
      expect(header.classList.contains('from-blue-600')).toBe(true);
      expect(header.classList.contains('to-purple-600')).toBe(true);
    });

    it('should have white background on statistics section', () => {
      // Assert
      const statsSection = fixture.nativeElement.querySelector('.bg-white');
      expect(statsSection).toBeTruthy();
    });

    it('should have proper padding on main content', () => {
      // Assert
      const contentDiv = fixture.nativeElement.querySelector('.p-8');
      expect(contentDiv).toBeTruthy();
    });
  });

  describe('Signal Reactivity in Template', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(Header);
    });

    it('should reactively update user count in template when input changes from 0 to 10', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);
      fixture.detectChanges();
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement.textContent.trim()).toBe('0');

      // Act
      fixture.componentRef.setInput('users', createMockUsers(10));
      fixture.detectChanges();

      // Assert
      expect(userCountElement.textContent.trim()).toBe('10');
    });

    it('should reactively update user count in template when input changes from 10 to 0', () => {
      // Arrange
      fixture.componentRef.setInput('users', createMockUsers(10));
      fixture.detectChanges();
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement.textContent.trim()).toBe('10');

      // Act
      fixture.componentRef.setInput('users', []);
      fixture.detectChanges();

      // Assert
      expect(userCountElement.textContent.trim()).toBe('0');
    });

    it('should reactively update user count in template with large numbers', () => {
      // Arrange
      fixture.componentRef.setInput('users', createMockUsers(100));
      fixture.detectChanges();
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement.textContent.trim()).toBe('100');

      // Act
      fixture.componentRef.setInput('users', createMockUsers(999));
      fixture.detectChanges();

      // Assert
      expect(userCountElement.textContent.trim()).toBe('999');
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(Header);
      component = fixture.componentInstance;
    });

    it('should handle users with different source types', () => {
      // Arrange
      const diverseUsers: User[] = [
        { id: 1, name: 'User 1', email: 'user1@test.com', avatar: 'avatar1.png', source: 'github' },
        { id: 2, name: 'User 2', email: 'user2@test.com', avatar: 'avatar2.png', source: 'internal' },
        { id: 3, name: 'User 3', email: 'user3@test.com', avatar: 'avatar3.png', source: 'jsonplaceholder' },
        { id: 4, name: 'User 4', email: 'user4@test.com', avatar: 'avatar4.png', source: 'twitter' },
      ];
      fixture.componentRef.setInput('users', diverseUsers);

      // Act
      fixture.detectChanges();

      // Assert
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement.textContent.trim()).toBe('4');
      expect(component.users().length).toBe(4);
    });

    it('should handle users with null joinedDate', () => {
      // Arrange
      const usersWithNullDate: User[] = [
        { id: 1, name: 'User 1', email: 'user1@test.com', avatar: 'avatar1.png', source: 'github', joinedDate: null },
        { id: 2, name: 'User 2', email: 'user2@test.com', avatar: 'avatar2.png', source: 'internal', joinedDate: null },
      ];
      fixture.componentRef.setInput('users', usersWithNullDate);

      // Act
      fixture.detectChanges();

      // Assert
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement.textContent.trim()).toBe('2');
      expect(component.users()).toEqual(usersWithNullDate);
    });

    it('should handle users with undefined joinedDate', () => {
      // Arrange
      const usersWithUndefinedDate: User[] = [
        { id: 1, name: 'User 1', email: 'user1@test.com', avatar: 'avatar1.png', source: 'github' },
        { id: 2, name: 'User 2', email: 'user2@test.com', avatar: 'avatar2.png', source: 'internal' },
      ];
      fixture.componentRef.setInput('users', usersWithUndefinedDate);

      // Act
      fixture.detectChanges();

      // Assert
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement.textContent.trim()).toBe('2');
      expect(component.users()).toEqual(usersWithUndefinedDate);
    });

    it('should handle rapid input changes', () => {
      // Arrange & Act - Rapid changes
      fixture.componentRef.setInput('users', createMockUsers(1));
      fixture.detectChanges();
      fixture.componentRef.setInput('users', createMockUsers(5));
      fixture.detectChanges();
      fixture.componentRef.setInput('users', createMockUsers(10));
      fixture.detectChanges();
      fixture.componentRef.setInput('users', createMockUsers(3));
      fixture.detectChanges();

      // Assert - Should reflect the last change
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement.textContent.trim()).toBe('3');
      expect(component.users().length).toBe(3);
    });
  });

  describe('Zoneless Change Detection', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(Header);
      component = fixture.componentInstance;
    });

    it('should not update DOM without explicit detectChanges call', () => {
      // Arrange
      fixture.componentRef.setInput('users', createMockUsers(5));
      fixture.detectChanges();
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement.textContent.trim()).toBe('5');

      // Act - Change input but don't call detectChanges
      fixture.componentRef.setInput('users', createMockUsers(10));
      // Note: In zoneless mode, we need explicit detectChanges

      // The signal value changes immediately
      expect(component.users().length).toBe(10);

      // But DOM is not updated yet
      expect(userCountElement.textContent.trim()).toBe('5');

      // Act - Now trigger change detection
      fixture.detectChanges();

      // Assert - DOM is now updated
      expect(userCountElement.textContent.trim()).toBe('10');
    });

    it('should properly update DOM when detectChanges is called after input change', () => {
      // Arrange
      fixture.componentRef.setInput('users', []);
      fixture.detectChanges();

      // Act
      fixture.componentRef.setInput('users', createMockUsers(7));
      fixture.detectChanges(); // Explicit change detection

      // Assert
      const userCountElement = fixture.nativeElement.querySelector('.text-blue-600');
      expect(userCountElement.textContent.trim()).toBe('7');
    });
  });
});
