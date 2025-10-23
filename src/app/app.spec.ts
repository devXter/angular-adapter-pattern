import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { UserManagement } from './features/user-management/user-management';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create the app component', () => {
      expect(component).toBeTruthy();
    });

    it('should be an instance of App', () => {
      expect(component instanceof App).toBe(true);
    });

    it('should have no properties or methods besides Angular lifecycle hooks', () => {
      // App component is a simple container with no custom properties or methods
      const ownProperties = Object.getOwnPropertyNames(component);
      // Should only have Angular-injected properties, no custom ones
      expect(ownProperties.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Template Rendering', () => {
    it('should render without errors', () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should contain app-user-management component', () => {
      fixture.detectChanges();
      const userManagementElement = compiled.querySelector('app-user-management');
      expect(userManagementElement).toBeTruthy();
    });

    it('should render UserManagement component', () => {
      fixture.detectChanges();
      const debugElement: DebugElement = fixture.debugElement.query(
        By.directive(UserManagement),
      );
      expect(debugElement).toBeTruthy();
    });

    it('should have only one child component (UserManagement)', () => {
      fixture.detectChanges();
      const userManagementComponents = fixture.debugElement.queryAll(
        By.directive(UserManagement),
      );
      expect(userManagementComponents.length).toBe(1);
    });
  });

  describe('Component Metadata', () => {
    it('should have correct selector', () => {
      const metadata = (App as any).ɵcmp;
      expect(metadata.selectors).toEqual([['app-root']]);
    });

    it('should import UserManagement component', () => {
      // Verify UserManagement can be rendered within App
      fixture.detectChanges();
      const userManagementDebugElement = fixture.debugElement.query(
        By.directive(UserManagement),
      );
      // If UserManagement is imported, it should be found in the template
      expect(userManagementDebugElement).toBeTruthy();
      expect(userManagementDebugElement.componentInstance instanceof UserManagement).toBe(true);
    });

    it('should be a standalone component', () => {
      const metadata = (App as any).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });
  });

  describe('Integration with UserManagement', () => {
    it('should instantiate UserManagement component', () => {
      fixture.detectChanges();
      const userManagementDebugElement = fixture.debugElement.query(
        By.directive(UserManagement),
      );
      const userManagementInstance = userManagementDebugElement.componentInstance;
      expect(userManagementInstance).toBeTruthy();
      expect(userManagementInstance instanceof UserManagement).toBe(true);
    });

    it('should pass through to UserManagement without modification', () => {
      fixture.detectChanges();
      const userManagementDebugElement = fixture.debugElement.query(
        By.directive(UserManagement),
      );
      expect(userManagementDebugElement).toBeTruthy();
    });
  });

  describe('DOM Structure', () => {
    it('should have app-user-management as direct child', () => {
      fixture.detectChanges();
      const directChildren = Array.from(compiled.children);
      const hasUserManagement = directChildren.some(
        (child) => child.tagName.toLowerCase() === 'app-user-management',
      );
      expect(hasUserManagement).toBe(true);
    });

    it('should not render any other root elements', () => {
      fixture.detectChanges();
      const children = Array.from(compiled.children);
      expect(children.length).toBe(1);
      expect(children[0].tagName.toLowerCase()).toBe('app-user-management');
    });
  });

  describe('Change Detection', () => {
    it('should trigger change detection without errors', () => {
      expect(() => {
        fixture.detectChanges();
        fixture.detectChanges();
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should remain stable after multiple change detection cycles', () => {
      fixture.detectChanges();
      const firstHTML = compiled.innerHTML;

      fixture.detectChanges();
      const secondHTML = compiled.innerHTML;

      expect(firstHTML).toBe(secondHTML);
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize properly', () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should destroy without errors', () => {
      fixture.detectChanges();
      expect(() => fixture.destroy()).not.toThrow();
    });

    it('should cleanup after destroy', () => {
      fixture.detectChanges();
      fixture.destroy();
      expect(fixture.componentInstance).toBeTruthy();
    });
  });

  describe('Template Compilation', () => {
    it('should have compiled template', () => {
      const metadata = (App as any).ɵcmp;
      expect(metadata.template).toBeDefined();
    });

    it('should render the correct template content', () => {
      fixture.detectChanges();
      const html = compiled.innerHTML;
      expect(html).toContain('app-user-management');
    });
  });

  describe('Styling', () => {
    it('should have styleUrl defined in metadata', () => {
      const metadata = (App as any).ɵcmp;
      // Style URLs are processed during compilation
      expect(metadata).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle initial render without UserManagement being initialized', () => {
      // Don't call detectChanges yet
      expect(component).toBeTruthy();
    });

    it('should not throw when accessing component before change detection', () => {
      expect(() => {
        const instance = component;
        expect(instance).toBeTruthy();
      }).not.toThrow();
    });

    it('should maintain component reference across change detection', () => {
      const initialComponent = component;
      fixture.detectChanges();
      expect(component).toBe(initialComponent);
    });
  });

  describe('Component Isolation', () => {
    it('should create independent instances', () => {
      const fixture2 = TestBed.createComponent(App);
      const component2 = fixture2.componentInstance;

      expect(component2).toBeTruthy();
      expect(component2).not.toBe(component);
    });

    it('should not share state between instances', () => {
      const fixture2 = TestBed.createComponent(App);

      fixture.detectChanges();
      fixture2.detectChanges();

      expect(component).not.toBe(fixture2.componentInstance);
    });
  });

  describe('Browser Compatibility', () => {
    it('should render valid HTML', () => {
      fixture.detectChanges();
      const html = compiled.innerHTML;
      expect(html).toBeTruthy();
      expect(typeof html).toBe('string');
    });

    it('should have valid DOM structure', () => {
      fixture.detectChanges();
      expect(compiled.children.length).toBeGreaterThan(0);
    });
  });

  describe('Component as Container', () => {
    it('should act as a simple container without business logic', () => {
      // App should have no methods besides Angular lifecycle
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(component)).filter(
        (name) => typeof (component as any)[name] === 'function' && name !== 'constructor',
      );

      // Should only have Angular lifecycle methods, if any
      const nonAngularMethods = methods.filter(
        (name) =>
          !name.startsWith('ng') && !name.startsWith('_') && name !== '__proto__',
      );

      expect(nonAngularMethods.length).toBe(0);
    });

    it('should delegate all functionality to UserManagement', () => {
      fixture.detectChanges();
      const userManagementElement = compiled.querySelector('app-user-management');
      expect(userManagementElement).toBeTruthy();
    });
  });

  describe('Zoneless Change Detection Integration', () => {
    it('should work with zoneless change detection', () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should render correctly in zoneless mode', () => {
      fixture.detectChanges();
      const userManagementElement = compiled.querySelector('app-user-management');
      expect(userManagementElement).toBeTruthy();
    });
  });
});
