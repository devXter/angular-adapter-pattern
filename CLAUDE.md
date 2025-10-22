# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Angular 20+ application** demonstrating the **Adapter Pattern** for integrating multiple user data sources (GitHub, Internal API, JSONPlaceholder, Twitter) into a unified User model. The project uses modern Angular features including standalone components, signals for state management, and zoneless change detection.

## Common Development Commands

### Development Server
```bash
npm start              # Start dev server at http://localhost:4200
ng serve               # Alternative command
```

### Build
```bash
npm run build          # Production build (output to dist/)
npm run watch          # Development build with watch mode
```

### Testing
```bash
npm test               # Run unit tests with Karma
ng test                # Alternative command
```

### Code Generation
```bash
ng generate component <name>    # Generate a new component
ng generate service <name>      # Generate a new service
ng generate interface <name>    # Generate a new interface
```

### Code Formatting
```bash
npx prettier --write .          # Format all files
npx prettier --check .          # Check formatting
```

## Architecture & Key Concepts

### Layer Architecture

The project follows a **feature-based architecture** with three main layers:

1. **Core Layer** (`src/app/core/`)
   - Reusable business logic, adapters, and base models
   - This is where the Adapter Pattern implementation lives

2. **Features Layer** (`src/app/features/`)
   - Feature-specific modules (e.g., user-management)
   - Contains components, services, and DTOs specific to each feature

3. **App Layer** (`src/app/`)
   - Bootstrap configuration and root component

### Adapter Pattern Implementation

The core of this application is the **Adapter Pattern**, which transforms heterogeneous data from multiple external sources into a unified `User` model.

#### Key Components:

1. **UserAdapter Interface** (`src/app/core/adapters/user.adapter.interface.ts`)
   - Defines the contract: `type UserAdapter<T> = { adapt(dto: T): User }`
   - All adapters must expose a static `adapt(dto: T): User` method

2. **BaseAdapter** (`src/app/core/adapters/base.adapter.ts`)
   - Abstract class with shared utility methods for validation and transformation
   - **All concrete adapters extend this class**
   - **IMPORTANT**: Uses exclusively static methods - adapters are never instantiated
   - This design choice ensures stateless, pure transformation functions
   - Provides methods like:
     - `requireField()` - Validates required fields
     - `isValidEmail()` - Email validation
     - `parseDateSafely()` - Safe date parsing
     - `sanitizeText()` - Text sanitization
     - `normalizeEmail()` - Email normalization
     - `parseNumber()` - Safe number parsing
     - `getValueOrDefault()` - Provides fallback values

3. **Concrete Adapters** (`src/app/core/adapters/`)
   - `GithubUserAdapter` - Transforms GitHub API DTOs (includes `joinedDate` from `created_at`)
   - `InternalUserAdapter` - Transforms internal API DTOs (includes `joinedDate` from `registeredAt`)
   - `JsonplaceholderUserAdapter` - Transforms JSONPlaceholder DTOs (no `joinedDate` available)
   - `TwitterUserAdapter` - Transforms Twitter API DTOs (includes `joinedDate` from `created_at`)
   - Each adapter extends `BaseAdapter` and implements the static `adapt()` method
   - Each adapter has private helper methods (e.g., `resolveName`, `resolveEmail`, `resolveAvatar`)

4. **Unified User Model** (`src/app/core/models/user.ts`)
   ```typescript
   interface User {
     id: number;
     name: string;
     email: string;
     avatar: string;
     joinedDate?: Date | null;
     source: 'internal' | 'github' | 'jsonplaceholder' | 'twitter';
   }
   ```

#### Orchestration Pattern

The `UserData` service (`src/app/features/user-management/services/user-data.ts`) orchestrates the adaptation process:
- Calls `adaptWithErrorHandling<T>()` for each data source
- Passes the adapter class (not instance) directly
- Handles errors per source independently - failures in one source don't affect others
- Aggregates all successfully adapted users into a signal

### State Management

This project uses **Angular Signals** (not RxJS subjects or observables):
- `WritableSignal<User[]>` for internal state
- `Signal<User[]>` (readonly) exposed to components
- Components consume signals with `users()` syntax in templates

### Modern Angular Features

- **Standalone Components** - No NgModules
- **Angular Signals** - Native reactive state management
- **Zoneless Change Detection** - Better performance via `provideZonelessChangeDetection()`
- **New Control Flow Syntax** - `@for`, `@if` in templates instead of `*ngFor`, `*ngIf`
- **Angular 20+** - Latest framework version

## Adding a New Data Source

To add a new external data source (e.g., GitLab):

1. **Create the DTO** in `src/app/features/user-management/models/`
   ```typescript
   export interface GitlabUserDto { ... }
   ```

2. **Create the Adapter** in `src/app/core/adapters/`
   ```typescript
   export class GitlabUserAdapter extends BaseAdapter {
     private static readonly ADAPTER_NAME = 'GitlabUserAdapter';
     private static readonly DEFAULT_AVATAR = 'default-avatar.svg';

     static adapt(dto: GitlabUserDto): User {
       // Validate using BaseAdapter methods
       this.requireField(dto, 'dto', this.ADAPTER_NAME);
       this.requireField(dto.id, 'id', this.ADAPTER_NAME);
       this.requireField(dto.username, 'username', this.ADAPTER_NAME);

       // Transform to unified User model
       return {
         id: dto.id,
         name: this.resolveName(dto.name, dto.username),
         email: this.resolveEmail(dto.email, dto.username),
         avatar: this.resolveAvatar(dto.avatar_url),
         joinedDate: this.parseDateSafely(dto.created_at),
         source: 'gitlab',  // Add 'gitlab' to User source type
       };
     }

     private static resolveName(name: string | null, username: string): string {
       const sanitizedName = this.sanitizeText(name || '', 100);
       return sanitizedName !== '' ? sanitizedName : username;
     }

     private static resolveEmail(email: string | null, username: string): string {
       if (email && this.isValidEmail(email)) {
         return this.normalizeEmail(email);
       }
       return `${username.toLowerCase()}@gitlab.com`;
     }

     private static resolveAvatar(avatarUrl?: string): string {
       return this.getValueOrDefault(avatarUrl, this.DEFAULT_AVATAR);
     }
   }
   ```

3. **Update User Model** - Add new source to the union type:
   ```typescript
   source: 'internal' | 'github' | 'jsonplaceholder' | 'twitter' | 'gitlab';
   ```

4. **Integrate in UserData Service**:
   ```typescript
   const gitlabData: GitlabUserDto[] = [...];
   this.adaptWithErrorHandling(gitlabData, GitlabUserAdapter, 'GitLab', adaptedUsers, errorList);
   ```

## Important Patterns & Conventions

### Error Handling Strategy

The application implements **multi-level error handling**:

1. **Adapter Level** - Validates data and throws descriptive errors
   - Uses `requireField()` for fail-fast validation
   - Throws errors with clear messages including adapter name and field name
   - Example: `[GithubUserAdapter] Missing or invalid required field: id`

2. **Service Level** - Catches adapter errors in `adaptWithErrorHandling()`, logs them, and continues processing other sources
   - Each data source is processed independently in its own try-catch block
   - Errors are collected in an array for later inspection
   - Successful adaptations continue even if some items fail

3. **Aggregation Level** - Collects all errors across sources and stores in signals
   - Errors signal maintains a list of all failures
   - Users signal only contains successfully adapted data

**Key principle**: A failure in one data source should never prevent other sources from being processed. This resilience is critical for the multi-source architecture.

### Adapter Design Principles

- **Static Methods Only** - Adapters use static methods; they are never instantiated
  - This ensures adapters are stateless and pure
  - Prevents accidental state mutation
  - Makes testing simpler (no need to manage instances)
- **Single Responsibility** - Each adapter handles only one data source
- **Shared Utilities** - Common validation/transformation logic lives in `BaseAdapter`
- **Type Safety** - Strong TypeScript typing throughout with no `any` types
- **Fail-Fast Validation** - Required fields validated immediately via `requireField()`
- **Defensive Programming** - All helper methods handle null/undefined gracefully

### File Naming Conventions

- Components: `user-card.ts`, `user-card.html`, `user-card.css`
- Services: `user-data.ts`
- Tests: `*.spec.ts`
- Models/DTOs: `github-user.ts`, `twitter-user.ts`
- Adapters: `github-user.adapter.ts`

### Import Path Aliases

The project uses standard Angular path resolution:
- Core imports: `@core/` (if configured) or relative paths
- Feature imports: `@features/` (if configured) or relative paths
- Currently using relative imports (e.g., `../../../core/adapters/`)

## Testing

Tests use **Jasmine** and **Karma**:
- Unit tests for adapters should test validation logic and transformations
- Component tests should verify template rendering and signal updates
- Service tests should verify orchestration and error handling

### Test File Locations
- Adapter tests: `src/app/core/adapters/*.spec.ts` (if created)
- Service tests: `src/app/features/user-management/services/*.spec.ts`
- Component tests: `src/app/features/user-management/components/**/*.spec.ts`

### Writing Adapter Tests

When creating tests for adapters, focus on:
1. **Valid data transformation** - Ensure correct mapping of all fields
2. **Missing required fields** - Verify `requireField()` throws errors
3. **Edge cases** - Test with null, undefined, empty strings
4. **Email validation** - Test both valid and invalid email formats
5. **Date parsing** - Test various date formats and invalid dates
6. **Fallback behavior** - Verify defaults are used when optional fields are missing

Example test structure:
```typescript
describe('GithubUserAdapter', () => {
  it('should transform valid DTO to User', () => {
    const dto: GithubUserDto = { /* valid data */ };
    const result = GithubUserAdapter.adapt(dto);
    expect(result.source).toBe('github');
    // ... more assertions
  });

  it('should throw error when required field is missing', () => {
    const dto: any = { /* missing id */ };
    expect(() => GithubUserAdapter.adapt(dto)).toThrow();
  });
});
```

## Styling

- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **PostCSS** - CSS transformation
- **Prettier with Tailwind plugin** - Automatic class sorting
- Global styles in `src/styles.css`
- Component-specific styles in component CSS files

### Prettier Configuration
The project has custom Prettier settings for Tailwind:
- Automatically sorts Tailwind classes
- Handles Angular-specific attributes (`ngClass`, `ngStyle`, `[class]`)
- Uses Angular parser for HTML templates

## TypeScript Configuration

- **Strict mode enabled** - No implicit any, strict null checks, etc.
- **Additional strict flags**:
  - `noImplicitOverride: true` - Requires explicit override keyword
  - `noPropertyAccessFromIndexSignature: true` - Prevents unsafe index access
  - `noImplicitReturns: true` - All code paths must return a value
  - `noFallthroughCasesInSwitch: true` - Prevents switch fallthrough bugs
- **ES2022 target** - Modern JavaScript features
- **Version 5.9.2** - Latest stable TypeScript
- **Angular Compiler Options**:
  - `strictTemplates: true` - Type checking in templates
  - `strictInjectionParameters: true` - Strict DI validation
  - `strictInputAccessModifiers: true` - Enforces input access modifiers

### Implications for Development

With strict mode enabled:
- You must explicitly type all function parameters and return values
- Cannot use `any` type without explicit annotation
- Null and undefined are distinct types
- Must handle all possible code paths in functions
- Template expressions are type-checked like TypeScript code

## Project Context

This is a **demonstration project** showcasing the Adapter Pattern in a real-world Angular application. The main learning objectives are:
1. How to integrate multiple heterogeneous data sources
2. How to apply SOLID principles in Angular
3. How to use modern Angular features (signals, standalone components, new control flow)
4. How to implement robust error handling in data transformation pipelines
