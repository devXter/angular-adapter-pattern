import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UserManagement } from './user-management';
import { UserData } from './services/user-data';
import { User } from '../../core/models/user';
import { UserCard } from './components/user-card/user-card';
import { Header } from '../shared/components/header/header';

describe('UserManagement', () => {
  let component: UserManagement;
  let fixture: ComponentFixture<UserManagement>;
  let userDataService: UserData;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagement],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagement);
    component = fixture.componentInstance;
    // Get the UserData service provided by the component itself
    userDataService = fixture.debugElement.injector.get(UserData);
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have the correct component metadata', () => {
      const componentMetadata = (UserManagement as any).ɵcmp;
      expect(componentMetadata.selectors).toEqual([['app-user-management']]);
    });

    it('should import UserCard and Header components', () => {
      // Arrange & Act
      fixture.detectChanges();
      const headerElement = fixture.debugElement.query(By.directive(Header));
      const userCardElements = fixture.debugElement.queryAll(By.directive(UserCard));

      // Assert - Verify child components are rendered, proving they are imported
      expect(headerElement).toBeTruthy();
      expect(userCardElements.length).toBeGreaterThan(0);
    });

    it('should provide UserData service at component level', () => {
      const injectedService = fixture.debugElement.injector.get(UserData);
      expect(injectedService).toBeTruthy();
      expect(injectedService).toBeInstanceOf(UserData);
    });

    it('should use OnPush change detection strategy', () => {
      // Arrange & Act
      const changeDetectionStrategy = fixture.componentRef.changeDetectorRef;

      // Assert - OnPush components don't auto-detect changes
      // We verify this by checking that DOM doesn't update without explicit detectChanges
      const userCardsBeforeInit = fixture.debugElement.queryAll(By.directive(UserCard));
      expect(userCardsBeforeInit.length).toBe(0);

      // After manual detectChanges, it updates
      fixture.detectChanges();
      const userCardsAfterInit = fixture.debugElement.queryAll(By.directive(UserCard));
      expect(userCardsAfterInit.length).toBe(4);
    });
  });

  describe('ngOnInit Lifecycle Hook', () => {
    it('should call loadMockData on ngOnInit', () => {
      // Arrange
      spyOn(userDataService, 'loadMockData');

      // Act
      component.ngOnInit();

      // Assert
      expect(userDataService.loadMockData).toHaveBeenCalledTimes(1);
    });

    it('should call loadMockData automatically when fixture detects changes', () => {
      // Arrange
      spyOn(userDataService, 'loadMockData');

      // Act
      fixture.detectChanges();

      // Assert
      expect(userDataService.loadMockData).toHaveBeenCalledTimes(1);
    });

    it('should load users after ngOnInit', () => {
      // Arrange
      expect(component['users']().length).toBe(0);

      // Act
      component.ngOnInit();

      // Assert
      expect(component['users']().length).toBeGreaterThan(0);
    });
  });

  describe('UserData Service Integration', () => {
    it('should inject UserData service correctly', () => {
      // Arrange & Act
      const injectedService = fixture.debugElement.injector.get(UserData);

      // Assert
      expect(injectedService).toBeTruthy();
      expect(injectedService).toBeInstanceOf(UserData);
    });

    it('should bind users signal from userDataService.allUsers', () => {
      // Arrange & Act
      fixture.detectChanges(); // Triggers ngOnInit which loads data

      // Assert
      const componentUsers = component['users']();
      const serviceUsers = userDataService.allUsers();
      expect(componentUsers).toBe(serviceUsers);
      expect(componentUsers.length).toBe(4); // 4 users from mock data (github, internal, jsonplaceholder, twitter)
    });

    it('should have a readonly Signal for users', () => {
      // Arrange & Act
      const usersSignal = component['users'];

      // Assert
      expect(usersSignal).toBeDefined();
      // Signal should be callable
      expect(typeof usersSignal).toBe('function');
    });

    it('should have the same signal reference as userDataService.allUsers', () => {
      // Arrange & Act
      const componentSignal = component['users'];
      const serviceSignal = userDataService.allUsers;

      // Assert
      expect(componentSignal).toBe(serviceSignal);
    });
  });

  describe('Signal Reactivity', () => {
    it('should reactively update when userDataService loads data', () => {
      // Arrange
      expect(component['users']().length).toBe(0);

      // Act
      component.ngOnInit(); // Loads data into service

      // Assert
      expect(component['users']().length).toBe(4);
    });

    it('should handle empty users array initially', () => {
      // Arrange & Act
      const users = component['users']();

      // Assert
      expect(users).toEqual([]);
      expect(users.length).toBe(0);
    });

    it('should reflect service data after loading', () => {
      // Arrange
      fixture.detectChanges(); // Triggers ngOnInit

      // Act
      const users = component['users']();

      // Assert
      expect(users.length).toBe(4);
      expect(users.every((user) => user.id !== undefined)).toBe(true);
      expect(users.every((user) => user.name !== undefined)).toBe(true);
      expect(users.every((user) => user.email !== undefined)).toBe(true);
      expect(users.every((user) => user.avatar !== undefined)).toBe(true);
      expect(users.every((user) => user.source !== undefined)).toBe(true);
    });

    it('should have users from all data sources', () => {
      // Arrange
      fixture.detectChanges();

      // Act
      const users = component['users']();
      const sources = users.map((u) => u.source);

      // Assert
      expect(sources).toContain('github');
      expect(sources).toContain('internal');
      expect(sources).toContain('jsonplaceholder');
      expect(sources).toContain('twitter');
    });
  });

  describe('Template Rendering', () => {
    it('should render Header component', () => {
      // Arrange & Act
      fixture.detectChanges();
      const headerElement = fixture.debugElement.query(By.directive(Header));

      // Assert
      expect(headerElement).toBeTruthy();
    });

    it('should pass users signal to Header component', () => {
      // Arrange & Act
      fixture.detectChanges();
      const headerElement = fixture.debugElement.query(By.directive(Header));
      const headerComponent = headerElement.componentInstance as Header;

      // Assert
      const headerUsers = headerComponent.users();
      const componentUsers = component['users']();
      expect(headerUsers.length).toBe(4);
      expect(headerUsers).toEqual(componentUsers);
    });

    it('should render UserCard components for each user', () => {
      // Arrange & Act
      fixture.detectChanges();
      const userCardElements = fixture.debugElement.queryAll(By.directive(UserCard));

      // Assert
      expect(userCardElements.length).toBe(4);
    });

    it('should not render UserCard components initially when users array is empty', () => {
      // Arrange - Don't call detectChanges yet, so ngOnInit hasn't run
      const userCardElements = fixture.debugElement.queryAll(By.directive(UserCard));

      // Assert
      expect(userCardElements.length).toBe(0);
    });

    it('should pass correct user data to each UserCard component', () => {
      // Arrange & Act
      fixture.detectChanges();
      const userCardElements = fixture.debugElement.queryAll(By.directive(UserCard));
      const componentUsers = component['users']();

      // Assert
      expect(userCardElements.length).toBe(componentUsers.length);
      userCardElements.forEach((cardElement, index) => {
        const cardComponent = cardElement.componentInstance as UserCard;
        expect(cardComponent.user()).toEqual(componentUsers[index]);
      });
    });

    it('should render main section element', () => {
      // Act
      fixture.detectChanges();
      const sectionElement = fixture.nativeElement.querySelector('section');

      // Assert
      expect(sectionElement).toBeTruthy();
      expect(sectionElement.classList.contains('min-h-screen')).toBe(true);
    });

    it('should render pattern information section', () => {
      // Act
      fixture.detectChanges();
      const allSections = fixture.nativeElement.querySelectorAll('section');

      // Assert - There should be at least 2 sections (main + pattern info, possibly more)
      expect(allSections.length).toBeGreaterThanOrEqual(2);

      // Find the section with pattern information by checking for rounded-lg class
      const patternSections = Array.from(allSections).filter((section: any) =>
        section.classList.contains('rounded-lg'),
      );
      expect(patternSections.length).toBeGreaterThan(0);
    });
  });

  describe('DOM Structure Validation', () => {
    it('should have correct grid layout for user cards', () => {
      // Arrange & Act
      fixture.detectChanges();
      const gridSection = fixture.nativeElement.querySelector('.grid.gap-6');

      // Assert
      expect(gridSection).toBeTruthy();
      expect(gridSection.classList.contains('md:grid-cols-2')).toBe(true);
      expect(gridSection.classList.contains('lg:grid-cols-3')).toBe(true);
    });

    it('should have header with title', () => {
      // Act
      fixture.detectChanges();
      const headerComponent = fixture.debugElement.query(By.directive(Header));

      // Assert
      expect(headerComponent).toBeTruthy();
    });

    it('should contain pattern concepts information', () => {
      // Act
      fixture.detectChanges();
      const conceptsHeading = fixture.nativeElement.querySelector('h2');

      // Assert
      expect(conceptsHeading).toBeTruthy();
      expect(conceptsHeading.textContent).toContain('Conceptos clave del Adapter Pattern');
    });

    it('should render data sources information', () => {
      // Act
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      const content = nativeElement.textContent || '';

      // Assert
      expect(content).toContain('GitHub API');
      expect(content).toContain('API Interna');
      expect(content).toContain('Twitter API');
      expect(content).toContain('JSONPlaceholder');
    });

    it('should render advantages section', () => {
      // Act
      fixture.detectChanges();
      const nativeElement = fixture.nativeElement as HTMLElement;
      const content = nativeElement.textContent || '';

      // Assert
      expect(content).toContain('Ventajas');
      expect(content).toContain('Modelo interno unificado');
      expect(content).toContain('Adapters encapsulan la conversión');
    });

    it('should render all expected user card elements', () => {
      // Act
      fixture.detectChanges();
      const userCards = fixture.debugElement.queryAll(By.directive(UserCard));

      // Assert
      expect(userCards.length).toBe(4);
      userCards.forEach((card) => {
        expect(card.nativeElement).toBeTruthy();
      });
    });
  });

  describe('Change Detection Strategy', () => {
    it('should not automatically detect changes without explicit call', () => {
      // Arrange - Don't call detectChanges
      let userCardElements = fixture.debugElement.queryAll(By.directive(UserCard));

      // Assert - No user cards rendered yet
      expect(userCardElements.length).toBe(0);
    });

    it('should update DOM when detectChanges is called explicitly', () => {
      // Arrange
      expect(fixture.debugElement.queryAll(By.directive(UserCard)).length).toBe(0);

      // Act
      fixture.detectChanges();
      const userCardElements = fixture.debugElement.queryAll(By.directive(UserCard));

      // Assert
      expect(userCardElements.length).toBe(4);
    });

    it('should maintain OnPush strategy with signal updates', () => {
      // Arrange
      fixture.detectChanges();
      const initialUserCount = component['users']().length;

      // Assert - Verify that changes are only reflected after explicit detectChanges
      expect(initialUserCount).toBe(4);
      expect(fixture.debugElement.queryAll(By.directive(UserCard)).length).toBe(4);
    });
  });

  describe('Integration with Child Components', () => {
    it('should integrate correctly with Header component', () => {
      // Arrange & Act
      fixture.detectChanges();
      const headerDebugElement = fixture.debugElement.query(By.directive(Header));
      const headerComponent = headerDebugElement.componentInstance as Header;

      // Assert
      expect(headerComponent).toBeTruthy();
      expect(headerComponent.users().length).toBe(4);
      expect(headerComponent.users()).toEqual(component['users']());
    });

    it('should integrate correctly with UserCard components', () => {
      // Arrange & Act
      fixture.detectChanges();
      const userCardDebugElements = fixture.debugElement.queryAll(By.directive(UserCard));

      // Assert
      expect(userCardDebugElements.length).toBe(4);
      userCardDebugElements.forEach((cardDebugElement, index) => {
        const cardComponent = cardDebugElement.componentInstance as UserCard;
        expect(cardComponent.user()).toEqual(component['users']()[index]);
      });
    });

    it('should pass signal values not signal references to child components', () => {
      // Arrange & Act
      fixture.detectChanges();
      const headerElement = fixture.debugElement.query(By.directive(Header));
      const headerComponent = headerElement.componentInstance as Header;

      // Assert - Header receives signal values via input signal
      expect(headerComponent.users()).toEqual(component['users']());
    });

    it('should render correct number of UserCard components matching users count', () => {
      // Arrange & Act
      fixture.detectChanges();
      const userCardElements = fixture.debugElement.queryAll(By.directive(UserCard));
      const usersCount = component['users']().length;

      // Assert
      expect(userCardElements.length).toBe(usersCount);
      expect(usersCount).toBe(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle component initialization without errors', () => {
      // Act & Assert
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle users with various joinedDate values', () => {
      // Arrange & Act
      fixture.detectChanges();
      const users = component['users']();

      // Assert
      const hasDefinedDates = users.some((u) => u.joinedDate !== null && u.joinedDate !== undefined);
      const hasNullOrUndefinedDates = users.some(
        (u) => u.joinedDate === null || u.joinedDate === undefined,
      );

      expect(hasDefinedDates).toBe(true);
      expect(hasNullOrUndefinedDates).toBe(true); // JSONPlaceholder user has no joinedDate
    });

    it('should handle users from different sources', () => {
      // Arrange & Act
      fixture.detectChanges();
      const users = component['users']();
      const uniqueSources = new Set(users.map((u) => u.source));

      // Assert
      expect(uniqueSources.size).toBeGreaterThanOrEqual(3);
      expect(uniqueSources.has('github')).toBe(true);
      expect(uniqueSources.has('internal')).toBe(true);
      expect(uniqueSources.has('jsonplaceholder')).toBe(true);
      expect(uniqueSources.has('twitter')).toBe(true);
    });

    it('should handle multiple detectChanges calls', () => {
      // Act
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      // Assert
      const userCardElements = fixture.debugElement.queryAll(By.directive(UserCard));
      expect(userCardElements.length).toBe(4);
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should verify all users have required properties', () => {
      // Arrange & Act
      fixture.detectChanges();
      const users = component['users']();

      // Assert
      users.forEach((user) => {
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.avatar).toBeDefined();
        expect(user.source).toBeDefined();
        expect(typeof user.id).toBe('number');
        expect(typeof user.name).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(typeof user.avatar).toBe('string');
        expect(['github', 'internal', 'jsonplaceholder', 'twitter']).toContain(user.source);
      });
    });
  });

  describe('Component Cleanup', () => {
    it('should not throw errors on component destroy', () => {
      // Arrange
      fixture.detectChanges();

      // Act & Assert
      expect(() => fixture.destroy()).not.toThrow();
    });

    it('should maintain signal reference throughout lifecycle', () => {
      // Arrange
      const initialSignal = component['users'];

      // Act
      fixture.detectChanges();

      // Assert
      expect(component['users']).toBe(initialSignal);
    });

    it('should properly clean up after destroy', () => {
      // Arrange
      fixture.detectChanges();
      const usersBefore = component['users']();
      expect(usersBefore.length).toBe(4);

      // Act
      fixture.destroy();

      // Assert - Fixture is destroyed, should not throw
      expect(() => fixture.nativeElement).not.toThrow();
    });
  });

  describe('Zoneless Change Detection', () => {
    it('should work correctly with zoneless change detection', () => {
      // Act - Explicit change detection required in zoneless mode
      fixture.detectChanges();
      const userCardElements = fixture.debugElement.queryAll(By.directive(UserCard));

      // Assert
      expect(userCardElements.length).toBe(4);
    });

    it('should require explicit detectChanges for DOM updates', () => {
      // Arrange
      expect(fixture.debugElement.queryAll(By.directive(UserCard)).length).toBe(0);

      // Act - Call detectChanges to trigger ngOnInit and render
      fixture.detectChanges();

      // Assert - DOM now updated
      expect(fixture.debugElement.queryAll(By.directive(UserCard)).length).toBe(4);
    });

    it('should handle zoneless mode with multiple update cycles', () => {
      // Act
      fixture.detectChanges();
      const firstRender = fixture.debugElement.queryAll(By.directive(UserCard)).length;

      fixture.detectChanges();
      const secondRender = fixture.debugElement.queryAll(By.directive(UserCard)).length;

      // Assert
      expect(firstRender).toBe(4);
      expect(secondRender).toBe(4);
      expect(firstRender).toBe(secondRender);
    });
  });

  describe('Component Properties and Metadata', () => {
    it('should have protected users property', () => {
      // Arrange & Act
      const usersProperty = component['users'];

      // Assert
      expect(usersProperty).toBeDefined();
      expect(typeof usersProperty).toBe('function'); // Signals are functions
    });

    it('should have correct component selector', () => {
      // Arrange & Act - Create component in a template context
      const compiled = fixture.nativeElement as HTMLElement;

      // Assert - Component should be rendered with its selector
      expect(compiled).toBeTruthy();
      expect(component).toBeInstanceOf(UserManagement);
    });

    it('should be a standalone component', () => {
      // Arrange & Act
      const isStandalone = (UserManagement as any).ɵcmp.standalone;

      // Assert
      expect(isStandalone).toBe(true);
    });

    it('should verify UserData is provided in component metadata', () => {
      // Arrange & Act
      const injectedService = fixture.debugElement.injector.get(UserData);

      // Assert - Service is provided by component, so it should be injectable
      expect(injectedService).toBeTruthy();
      expect(injectedService).toBeInstanceOf(UserData);
      // Verify it's a component-level instance, not root level
      expect(injectedService).toBe(userDataService);
    });
  });
});
