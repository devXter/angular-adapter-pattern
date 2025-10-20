# Angular Adapter Pattern - User Management System

> Aplicación Angular moderna que demuestra la implementación del **Patrón Adapter** para integrar múltiples fuentes de datos de usuarios con una interfaz unificada.

## Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Patrón de Diseño: Adapter Pattern](#patrón-de-diseño-adapter-pattern)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Modelos y Adaptadores](#modelos-y-adaptadores)
- [Instalación y Configuración](#instalación-y-configuración)
- [Comandos Disponibles](#comandos-disponibles)
- [Flujo de Datos](#flujo-de-datos)
- [Extender el Sistema](#extender-el-sistema)
- [Recursos Adicionales](#recursos-adicionales)

---

## Descripción del Proyecto

Este proyecto es una **aplicación de gestión de usuarios** que integra datos de múltiples fuentes externas y los unifica en un modelo común. La aplicación demuestra cómo el **Patrón Adapter** permite integrar diferentes APIs con estructuras de datos heterogéneas sin acoplamiento directo.

### Características Principales

- **Integración Multi-Fuente**: Obtiene usuarios de 4 fuentes diferentes
  - GitHub API
  - API Interna
  - JSONPlaceholder API
  - Twitter API

- **Normalización de Datos**: Transforma estructuras de datos dispares en un modelo unificado
- **Manejo de Errores Robusto**: Validación y manejo de errores durante la transformación
- **UI Moderna**: Interfaz de tarjetas responsive con Tailwind CSS
- **State Management Reactivo**: Uso de Angular Signals para gestión de estado

### Vista Previa

La aplicación muestra una grilla de tarjetas de usuario con:
- Avatar del usuario
- Nombre completo
- Correo electrónico
- Fecha de registro (si está disponible)
- Badge indicando la fuente de datos

---

## Tecnologías Utilizadas

### Framework y Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Angular** | 20.3.0 | Framework principal con detección de cambios zoneless |
| **TypeScript** | 5.9.2 | Lenguaje de programación con tipado estricto |
| **RxJS** | 7.8.0 | Programación reactiva |

### UI y Estilos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Tailwind CSS** | 4.1.14 | Framework de utilidades CSS |
| **PostCSS** | 8.5.6 | Transformación de CSS |
| **Prettier** | 3.6.2 | Formateo de código con soporte Tailwind |

### Testing y Desarrollo

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Karma** | 6.4.0 | Test runner |
| **Jasmine** | 5.9.0 | Framework de testing |
| **Angular CLI** | 20.3.6 | Herramientas de desarrollo y build |

### Características Modernas de Angular 20+

- **Standalone Components**: Sin NgModules
- **Angular Signals**: State management reactivo nativo
- **Zoneless Change Detection**: Mejor rendimiento
- **Nueva Sintaxis de Control Flow**: `@for`, `@if` en templates

---

## Arquitectura del Proyecto

El proyecto sigue una **arquitectura basada en características** con tres capas principales:

```
┌─────────────────────────────────────────────────────────────┐
│                      CAPA DE APLICACIÓN                      │
│                  (Bootstrap y componente raíz)               │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                     CAPA DE FEATURES                         │
│        (Módulos de características - User Management)       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Components   │  │   Services   │  │  Models/DTOs │     │
│  │              │  │              │  │              │     │
│  │ UserCard     │  │  UserData    │  │ GitHub DTO   │     │
│  │ UserMgmt     │  │              │  │ Internal DTO │     │
│  └──────────────┘  └──────────────┘  │ Twitter DTO  │     │
│                                       │ JSONPh. DTO  │     │
│                                       └──────────────┘     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                       CAPA CORE                              │
│             (Lógica reutilizable de negocio)                 │
│                                                              │
│  ┌──────────────┐  ┌──────────────────────────────────┐    │
│  │    Models    │  │         Adapters                 │    │
│  │              │  │                                  │    │
│  │     User     │  │  BaseAdapter (abstracto)        │    │
│  │ (unificado)  │  │         ▲                        │    │
│  └──────────────┘  │         │                        │    │
│                    │  ┌──────┴──────┬──────┬──────┐  │    │
│                    │  │             │      │      │  │    │
│                    │  GitHub   Internal  JSON  Twitter    │
│                    │  Adapter  Adapter   Adapter Adapter  │
│                    └──────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Principios SOLID Aplicados

- **Single Responsibility**: Cada adapter maneja solo la transformación de una fuente
- **Open/Closed**: Abierto a extensión (nuevos adapters), cerrado a modificación
- **Liskov Substitution**: Todos los adapters implementan `UserAdapter<T>`
- **Interface Segregation**: Interfaces mínimas y enfocadas
- **Dependency Inversion**: Dependencia en abstracciones, no implementaciones

---

## Patrón de Diseño: Adapter Pattern

### ¿Qué es el Patrón Adapter?

El **Patrón Adapter** (también conocido como Wrapper) es un patrón estructural que permite que interfaces incompatibles trabajen juntas. Actúa como un puente entre dos interfaces, transformando la interfaz de una clase en otra que el cliente espera.

### Problema que Resuelve

Imagina que tienes una aplicación que necesita mostrar información de usuarios, pero obtiene datos de múltiples fuentes:

```typescript
// GitHub te da esto:
{
  id: 12345,
  login: 'johndoe',
  avatar_url: 'https://...',
  email: null,
  created_at: '2020-01-01T00:00:00Z'
}

// Tu API interna te da esto:
{
  userId: '67890',
  fullName: 'John Doe',
  emailAddress: 'john@example.com',
  profileImage: 'https://...',
  registeredAt: '2020-01-01'
}

// ¡Son completamente diferentes!
```

**Sin el patrón Adapter**, tendrías que:
- Escribir lógica de transformación en múltiples lugares
- Acoplar tus componentes a estructuras de datos externas
- Duplicar código de validación y normalización

### Solución con Adapter Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                  Fuentes de Datos Externas                  │
│      (Diferentes estructuras, campos, tipos)                │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
             ▼                                ▼
┌────────────────────────┐       ┌────────────────────────┐
│   GitHub API DTO       │       │   Internal API DTO     │
│                        │       │                        │
│  {                     │       │  {                     │
│    id: number          │       │    userId: string      │
│    login: string       │       │    fullName: string    │
│    avatar_url: string  │       │    emailAddress: ...   │
│    ...                 │       │    ...                 │
│  }                     │       │  }                     │
└────────────┬───────────┘       └───────────┬────────────┘
             │                               │
             │    ┌─────────────────────┐    │
             └───▶│  ADAPTER LAYER      │◀───┘
                  │                     │
                  │  Transforma datos   │
                  │  incompatibles a    │
                  │  un modelo unificado│
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Modelo Unificado  │
                  │                     │
                  │  interface User {   │
                  │    id: number       │
                  │    name: string     │
                  │    email: string    │
                  │    avatar: string   │
                  │    joinedDate?: Date│
                  │    source: string   │
                  │  }                  │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Capa de UI        │
                  │   (Componentes)     │
                  │                     │
                  │   Siempre reciben   │
                  │   el mismo formato  │
                  └─────────────────────┘
```

### Implementación en el Proyecto

#### 1. Interfaz del Adapter (Contrato)

```typescript
// src/app/core/adapters/user.adapter.interface.ts
type UserAdapter<T> = {
  adapt(dto: T): User;
};
```

Esta interfaz define el contrato: **cualquier adapter debe recibir un DTO de tipo `T` y devolver un `User`**.

#### 2. Clase Base Abstracta con Utilidades

```typescript
// src/app/core/adapters/base.adapter.ts
export abstract class BaseAdapter {
  // Métodos de utilidad compartidos
  protected isValidEmail(email: string): boolean { ... }
  protected parseDateSafely(dateString: string): Date | null { ... }
  protected sanitizeText(text: string, maxLength?: number): string { ... }
  protected requireField<T>(value: T | null | undefined, fieldName: string): T { ... }
  // ... más utilidades
}
```

#### 3. Adapters Concretos

Cada fuente de datos tiene su propio adapter que hereda de `BaseAdapter`:

```typescript
// src/app/core/adapters/github-user.adapter.ts
export class GithubUserAdapter extends BaseAdapter implements UserAdapter<GithubUserDto> {
  adapt(dto: GithubUserDto): User {
    // Valida campos requeridos
    this.requireField(dto.id, 'id');
    this.requireField(dto.login, 'login');

    // Transforma al modelo unificado
    return {
      id: dto.id,
      name: this.sanitizeText(dto.name || dto.login),
      email: this.isValidEmail(dto.email || '')
        ? this.normalizeEmail(dto.email!)
        : `${dto.login}@github.com`,
      avatar: dto.avatar_url || 'https://via.placeholder.com/150',
      joinedDate: this.parseDateSafely(dto.created_at),
      source: 'github',
    };
  }
}
```

### Beneficios del Patrón

✅ **Desacoplamiento**: Los componentes no conocen las APIs externas
✅ **Extensibilidad**: Agregar una nueva fuente = crear un nuevo adapter
✅ **Mantenibilidad**: Cambios en APIs externas solo afectan su adapter
✅ **Reutilización**: `BaseAdapter` comparte lógica común
✅ **Testabilidad**: Cada adapter se puede probar aisladamente
✅ **Consistencia**: Todos los datos fluyen con el mismo formato

---

## Estructura de Carpetas

```
angular-adapter-pattern/
│
├── src/
│   ├── app/
│   │   │
│   │   ├── core/                          # Lógica central reutilizable
│   │   │   ├── adapters/                  # 🎯 Patrón Adapter
│   │   │   │   ├── base.adapter.ts        # Clase base abstracta
│   │   │   │   ├── user.adapter.interface.ts  # Contrato del adapter
│   │   │   │   ├── github-user.adapter.ts     # Adapter para GitHub
│   │   │   │   ├── internal-user.adapter.ts   # Adapter para API interna
│   │   │   │   ├── jsonplaceholder-user.adapter.ts
│   │   │   │   └── twitter-user.adapter.ts
│   │   │   │
│   │   │   └── models/
│   │   │       └── user.ts                # Modelo User unificado
│   │   │
│   │   ├── features/                      # Módulos por característica
│   │   │   └── user-management/
│   │   │       ├── models/                # DTOs de APIs externas
│   │   │       │   ├── github-user.ts
│   │   │       │   ├── internal-user.ts
│   │   │       │   ├── jsonplaceholder-user.ts
│   │   │       │   └── twitter-user.ts
│   │   │       │
│   │   │       ├── services/
│   │   │       │   ├── user-data.ts       # Servicio orquestador
│   │   │       │   └── user-data.spec.ts  # Tests
│   │   │       │
│   │   │       ├── components/
│   │   │       │   └── user-card/         # Componente de tarjeta
│   │   │       │       ├── user-card.ts
│   │   │       │       ├── user-card.html
│   │   │       │       ├── user-card.css
│   │   │       │       └── user-card.spec.ts
│   │   │       │
│   │   │       ├── user-management.ts     # Componente principal
│   │   │       ├── user-management.html
│   │   │       ├── user-management.css
│   │   │       └── user-management.spec.ts
│   │   │
│   │   ├── app.ts                         # Componente raíz
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.config.ts                  # Configuración de la app
│   │   ├── app.routes.ts                  # Rutas
│   │   └── app.spec.ts
│   │
│   ├── main.ts                            # Punto de entrada (bootstrap)
│   ├── index.html
│   └── styles.css                         # Estilos globales (Tailwind)
│
├── public/                                # Assets estáticos
├── package.json                           # Dependencias y scripts
├── angular.json                           # Configuración de Angular CLI
├── tsconfig.json                          # Configuración de TypeScript
└── README.md                              # Este archivo
```

### Organización por Capas

| Capa | Ubicación | Responsabilidad |
|------|-----------|-----------------|
| **Core** | `src/app/core/` | Lógica de negocio reutilizable (adapters, modelos base) |
| **Features** | `src/app/features/` | Módulos de características específicas |
| **App** | `src/app/` | Bootstrap y componente raíz |

---

## Modelos y Adaptadores

### Modelo Unificado: User

```typescript
// src/app/core/models/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  joinedDate?: Date | null;
  source: 'internal' | 'github' | 'jsonplaceholder' | 'twitter';
}
```

### DTOs de Fuentes Externas

#### GitHub User DTO

```typescript
export interface GithubUserDto {
  id: number;
  login: string;              // Nombre de usuario
  avatar_url: string;
  email: string | null;       // Puede ser null
  created_at: string;         // ISO 8601
  name: string | null;        // Puede ser null
}
```

**Transformaciones:**
- `name`: Usa `name` si existe, sino `login`
- `email`: Genera `{login}@github.com` si es null
- `created_at`: Parseado a `Date`

#### Internal User DTO

```typescript
export interface InternalUserDto {
  userId: string;             // String que se convierte a number
  fullName: string;
  emailAddress: string;
  profileImage: string;
  registeredAt: string;       // Fecha como string
}
```

**Transformaciones:**
- `userId`: Convertido de string a number
- `emailAddress`: Validado y normalizado
- `registeredAt`: Parseado a `Date`

#### JSONPlaceholder User DTO

```typescript
export interface JsonplaceholderUserDto {
  id: number;
  name: string;
  email: string;
  username: string;
}
```

**Transformaciones:**
- Sin `joinedDate` disponible
- Avatar por defecto asignado
- Email validado estrictamente

#### Twitter User DTO

```typescript
export interface TwitterUserDto {
  id_str: string;             // ID como string
  screen_name: string;
  name: string;
  profile_image_url_https: string;
  created_at: string;         // Formato Twitter
  verified: boolean;
  followers_count: number;
}
```

**Transformaciones:**
- `id_str`: Convertido a number
- `profile_image_url`: Mejorado (_normal → _400x400)
- `email`: Generado como `{screen_name}@twitter.com`
- `created_at`: Parseado desde formato Twitter

### Comparativa de Fuentes

| Campo | GitHub | Internal | JSONPlaceholder | Twitter |
|-------|--------|----------|-----------------|---------|
| **ID** | number | string→number | number | string→number |
| **Nombre** | name \|\| login | fullName | name | name \|\| screen_name |
| **Email** | email \|\| generado | emailAddress | email | generado |
| **Avatar** | avatar_url | profileImage | ❌ default | profile_image_url (mejorado) |
| **Fecha** | created_at | registeredAt | ❌ null | created_at |

---

## Instalación y Configuración

### Requisitos Previos

- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **Angular CLI**: v20.3.6 (se instala con el proyecto)

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd angular-adapter-pattern
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Verificar instalación**

```bash
npm run ng version
```

---

## Comandos Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo (http://localhost:4200)
npm start
# o
ng serve
```

### Build

```bash
# Build de producción (optimizado)
npm run build

# Build en modo desarrollo con watch
npm run watch
```

### Testing

```bash
# Ejecutar tests unitarios
npm test
# o
ng test
```

### Linting y Formato

```bash
# Formatear código con Prettier
npx prettier --write .

# Verificar formato
npx prettier --check .
```

### Scaffolding (Generación de Código)

```bash
# Generar un componente
ng generate component nombre-componente

# Generar un servicio
ng generate service nombre-servicio

# Generar una interfaz
ng generate interface nombre-interfaz

# Ver todas las opciones
ng generate --help
```

---

## Flujo de Datos

### Inicialización de la Aplicación

```
1. main.ts
   └─> bootstrapApplication(App, appConfig)
       │
       ├─> Configuración:
       │   ├─ provideZonelessChangeDetection()
       │   ├─ provideRouter(routes)
       │   └─ Error listeners
       │
       └─> App Component
           └─> UserManagement Component
               │
               ├─> Constructor: Inyecta UserData Service
               │
               └─> ngOnInit()
                   └─> userDataService.loadMockData()
                       │
                       ├─> Adapta datos de GitHub
                       ├─> Adapta datos de Internal API
                       ├─> Adapta datos de JSONPlaceholder
                       ├─> Adapta datos de Twitter
                       │
                       └─> users.set([...todosLosUsuariosAdaptados])
                           │
                           └─> Signal actualizado
                               │
                               └─> Template se re-renderiza
                                   │
                                   └─> @for (user of users())
                                       └─> <app-user-card [user]="user">
```

### Flujo de Transformación de Datos

```
┌──────────────────────────────────────────────────────────────┐
│                    Datos Externos (DTOs)                     │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│              UserData.adaptWithErrorHandling()               │
│                                                              │
│  for (dto of dtos) {                                        │
│    try {                                                     │
│      user = adapter.adapt(dto)  ──────┐                    │
│      adaptedUsers.push(user)           │                    │
│    } catch (error) {                   │                    │
│      errors.push(error.message)        │                    │
│    }                                   │                    │
│  }                                     │                    │
└────────────────────────────────────────┼────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────┐
│                  Adapter Concreto                            │
│                  (ej: GithubUserAdapter)                     │
│                                                              │
│  adapt(dto: GithubUserDto): User {                          │
│                                                              │
│    1. Validación (using BaseAdapter methods):               │
│       ├─> requireField(dto.id, 'id')                        │
│       ├─> requireField(dto.login, 'login')                  │
│       └─> isValidEmail(dto.email)                           │
│                                                              │
│    2. Transformación:                                        │
│       ├─> name = sanitizeText(dto.name || dto.login)        │
│       ├─> email = normalizeEmail(...)                       │
│       ├─> joinedDate = parseDateSafely(dto.created_at)      │
│       └─> source = 'github'                                 │
│                                                              │
│    3. Retornar User unificado                               │
│  }                                                           │
└────────────────────────────────────┬─────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────┐
│                  Modelo User Unificado                       │
│                                                              │
│  {                                                           │
│    id: 12345,                                               │
│    name: "John Doe",                                        │
│    email: "john@example.com",                               │
│    avatar: "https://...",                                   │
│    joinedDate: Date(2020-01-01),                            │
│    source: "github"                                         │
│  }                                                           │
└────────────────────────────────────┬─────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────┐
│              UserData Service (State)                        │
│                                                              │
│  private users = signal<User[]>([...])                      │
│  readonly allUsers = this.users.asReadonly()                │
└────────────────────────────────────┬─────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────┐
│             UserManagement Component                         │
│                                                              │
│  Template:                                                   │
│  @for (user of users(); track user.id) {                    │
│    <app-user-card [user]="user" />                          │
│  }                                                           │
└────────────────────────────────────┬─────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────┐
│                  UserCard Component                          │
│                                                              │
│  Muestra:                                                    │
│  ├─ Avatar                                                   │
│  ├─ Nombre                                                   │
│  ├─ Email                                                    │
│  ├─ Fecha (con DatePipe)                                    │
│  └─ Badge de fuente (coloreado dinámicamente)               │
└──────────────────────────────────────────────────────────────┘
```

### Manejo de Errores

El sistema implementa manejo de errores en múltiples niveles:

```typescript
// Nivel 1: Validación en Adapters
class GithubUserAdapter {
  adapt(dto: GithubUserDto): User {
    // Si falla, lanza Error
    this.requireField(dto.id, 'id');
    // ...
  }
}

// Nivel 2: Captura en UserData Service
adaptWithErrorHandling<T>(dtos: T[], adapter: any, source: string) {
  const adapted: User[] = [];
  const errors: string[] = [];

  dtos.forEach((dto, index) => {
    try {
      adapted.push(adapter.adapt(dto));
    } catch (error) {
      // Captura el error, lo registra y continúa
      errors.push(`Error en ${source} [${index}]: ${error.message}`);
      console.error(error);
    }
  });

  return { adapted, errors };
}

// Nivel 3: Agregación en loadMockData()
loadMockData() {
  const allErrors: string[] = [];

  // Procesa cada fuente independientemente
  // Un error en una fuente no detiene las demás

  this.errors.set(allErrors);  // Almacena todos los errores
}
```

**Beneficios:**
- ✅ Un error en una fuente no detiene las demás
- ✅ Errores contextuales con nombre de fuente e índice
- ✅ La UI siempre muestra los datos que se pudieron cargar
- ✅ Errores registrados en consola para debugging

---

## Extender el Sistema

### Agregar una Nueva Fuente de Datos

Supongamos que queremos agregar **GitLab** como nueva fuente de usuarios.

#### Paso 1: Crear el DTO

```typescript
// src/app/features/user-management/models/gitlab-user.ts
export interface GitlabUserDto {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar_url: string;
  created_at: string;
  bio: string;
}
```

#### Paso 2: Crear el Adapter

```typescript
// src/app/core/adapters/gitlab-user.adapter.ts
import { BaseAdapter } from './base.adapter';
import { UserAdapter } from './user.adapter.interface';
import { User } from '../models/user';
import { GitlabUserDto } from '@features/user-management/models/gitlab-user';

export class GitlabUserAdapter extends BaseAdapter implements UserAdapter<GitlabUserDto> {
  adapt(dto: GitlabUserDto): User {
    // 1. Validar campos requeridos
    this.requireField(dto.id, 'id');
    this.requireField(dto.username, 'username');

    // 2. Validar reglas de negocio
    if (dto.id <= 0) {
      throw new Error('GitLab user ID must be positive');
    }

    if (dto.email && !this.isValidEmail(dto.email)) {
      throw new Error(`Invalid email format: ${dto.email}`);
    }

    // 3. Transformar al modelo unificado
    return {
      id: dto.id,
      name: this.sanitizeText(dto.name || dto.username),
      email: this.normalizeEmail(dto.email || `${dto.username}@gitlab.com`),
      avatar: dto.avatar_url || 'https://via.placeholder.com/150',
      joinedDate: this.parseDateSafely(dto.created_at),
      source: 'gitlab',  // ⚠️ Actualizar el tipo User
    };
  }
}
```

#### Paso 3: Actualizar el Modelo User

```typescript
// src/app/core/models/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  joinedDate?: Date | null;
  source: 'internal' | 'github' | 'jsonplaceholder' | 'twitter' | 'gitlab';  // ✅ Agregar 'gitlab'
}
```

#### Paso 4: Integrar en UserData Service

```typescript
// src/app/features/user-management/services/user-data.ts
import { GitlabUserAdapter } from '@core/adapters/gitlab-user.adapter';
import { GitlabUserDto } from '../models/gitlab-user';

loadMockData(): void {
  const adaptedUsers: User[] = [];
  const errorList: string[] = [];

  // ... adapters existentes ...

  // ✅ Agregar adapter de GitLab
  const gitlabData: GitlabUserDto[] = [
    {
      id: 1234567,
      username: 'johndoe',
      name: 'John Doe',
      email: 'john@gitlab.com',
      avatar_url: 'https://gitlab.com/uploads/user/avatar/1234567/avatar.png',
      created_at: '2019-05-15T10:30:00Z',
      bio: 'Software Engineer',
    },
    // ... más usuarios
  ];

  const { adapted: gitlabUsers, errors: gitlabErrors } = this.adaptWithErrorHandling(
    gitlabData,
    GitlabUserAdapter,
    'GitLab'
  );

  adaptedUsers.push(...gitlabUsers);
  errorList.push(...gitlabErrors);

  // Actualizar signals
  this.users.set(adaptedUsers);
  this.errors.set(errorList);
}
```

#### Paso 5: Actualizar el UserCard Component (Opcional)

Si quieres un color específico para el badge de GitLab:

```typescript
// src/app/features/user-management/components/user-card/user-card.ts
getBadgeColor(): string {
  const colors: Record<User['source'], string> = {
    github: 'bg-gray-800 text-white',
    internal: 'bg-blue-600 text-white',
    jsonplaceholder: 'bg-green-600 text-white',
    twitter: 'bg-sky-500 text-white',
    gitlab: 'bg-orange-600 text-white',  // ✅ Nuevo color
  };
  return colors[this.user().source];
}
```

### ¡Listo! 🎉

Ahora tienes GitLab integrado siguiendo el patrón Adapter. La arquitectura te permitió:

- ✅ No modificar código existente (excepto el tipo `User`)
- ✅ No cambiar componentes ni templates
- ✅ Agregar la nueva fuente de forma aislada
- ✅ Mantener el manejo de errores consistente

---

## Recursos Adicionales

### Documentación Oficial

- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Patrones de Diseño

- [Refactoring Guru - Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [TypeScript Design Patterns](https://www.patterns.dev/posts/classic-design-patterns)

### Angular Features Modernas

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [Zoneless Change Detection](https://angular.dev/guide/experimental/zoneless)

### Mejores Prácticas

- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

**¡Feliz codificación!** 🚀
