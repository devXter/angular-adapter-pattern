# Angular Adapter Pattern - User Management System

> Aplicación Angular que demuestra la implementación del **Patrón Adapter** para integrar múltiples fuentes de datos con estructuras heterogéneas en una interfaz unificada.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [El Patrón Adapter](#-el-patrón-adapter)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Instalación y Uso](#-instalación-y-uso)
- [Extender el Sistema](#-extender-el-sistema)
- [Recursos Adicionales](#-recursos-adicionales)

---

## 🎯 Descripción del Proyecto

Este proyecto es una **demostración práctica** de cómo aplicar el **Patrón Adapter** en una aplicación Angular moderna. La aplicación integra datos de **4 fuentes diferentes** (GitHub, API Interna, JSONPlaceholder, Twitter) y los presenta de manera unificada.

### Características Principales

- ✅ **Integración Multi-Fuente**: Combina datos de APIs con estructuras completamente diferentes
- ✅ **Normalización Automática**: Transforma datos heterogéneos en un modelo común
- ✅ **Manejo de Errores Robusto**: Fallos en una fuente no afectan las demás
- ✅ **UI Moderna**: Interfaz responsive con Tailwind CSS
- ✅ **Angular 20+**: Utiliza las últimas características (Signals, Standalone Components, Zoneless)

### Vista Previa

La aplicación muestra una grilla de tarjetas de usuario con:

- Avatar del usuario
- Nombre completo
- Correo electrónico
- Fecha de registro (cuando está disponible)
- Badge indicando la fuente de datos

---

## 🛠️ Tecnologías Utilizadas

### Core

- **Angular 20.3** - Framework con standalone components y signals
- **TypeScript 5.9** - Tipado estático
- **RxJS 7.8** - Programación reactiva

### UI & Styling

- **Tailwind CSS 4.1** - Utility-first CSS
- **Prettier** - Code formatting

### Testing

- **Karma + Jasmine** - Unit testing

### Características Modernas de Angular

- 🔥 **Standalone Components** - Sin NgModules
- 🔥 **Angular Signals** - State management reactivo nativo
- 🔥 **Zoneless Change Detection** - Mejor rendimiento
- 🔥 **Nueva sintaxis**: `@for`, `@if` en templates

---

## 🔧 El Patrón Adapter

### ¿Qué es el Patrón Adapter?

El **Patrón Adapter** (también conocido como Wrapper) es un patrón estructural que permite que interfaces incompatibles trabajen juntas. Actúa como un **traductor** entre dos sistemas con formatos diferentes.

### El Problema que Resuelve

Imagina que tu aplicación necesita mostrar usuarios, pero cada fuente de datos tiene su propia estructura:

**GitHub API:**

```json
{
  "id": 123,
  "login": "johndoe",
  "avatar_url": "https://...",
  "email": null,
  "created_at": "2020-01-01T00:00:00Z"
}
```

**Tu API Interna:**

```json
{
  "userId": "456",
  "fullName": "John Doe",
  "emailAddress": "john@example.com",
  "profileImage": "https://...",
  "registeredAt": "2020-01-01"
}
```

**JSONPlaceholder:**

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "leanne@example.com"
}
```

¡Estructuras completamente diferentes! Sin el patrón Adapter tendrías que:

- ❌ Escribir lógica de transformación en múltiples lugares
- ❌ Acoplar tus componentes a estructuras externas
- ❌ Duplicar validación y normalización

### La Solución: Adapter Pattern

El patrón crea una **capa de adaptación** que transforma cada estructura en un **modelo unificado**:

```
┌─────────────────────────────────────────────────────────────┐
│                  Fuentes de Datos Externas                  │
│          (Diferentes estructuras, campos, tipos)            │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
             ▼                                ▼
    ┌─────────────────┐              ┌─────────────────┐
    │  GitHub Adapter │              │ Internal Adapter│
    │                 │              │                 │
    │  adapt(dto) {   │              │  adapt(dto) {   │
    │    return {     │              │    return {     │
    │      id: dto.id │              │      id: parse  │
    │      name: ...  │              │      name: ...  │
    │      ...        │              │      ...        │
    │    }            │              │    }            │
    │  }              │              │  }              │
    └────────┬────────┘              └────────┬────────┘
             │                                │
             └────────────┬───────────────────┘
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
                │   Componentes UI    │
                │   (siempre reciben  │
                │   el mismo formato) │
                └─────────────────────┘
```

### Beneficios Clave

✅ **Desacoplamiento**: Los componentes no conocen las APIs externas
✅ **Extensibilidad**: Agregar una nueva fuente = crear un nuevo adapter
✅ **Mantenibilidad**: Cambios en APIs solo afectan su adapter
✅ **Reutilización**: Lógica común compartida en clase base
✅ **Testabilidad**: Cada adapter se prueba aisladamente
✅ **Consistencia**: Todos los datos fluyen con el mismo formato

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Capas

El proyecto sigue una **arquitectura basada en características** con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE APLICACIÓN                       │
│                (Bootstrap y configuración)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                     CAPA DE FEATURES                        │
│              (Características de negocio)                   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Components   │  │   Services   │  │  Models/DTOs │       │
│  │ (UI)         │  │ (Orquestador)│  │  (Externas)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                       CAPA CORE                             │
│              (Lógica reutilizable de negocio)               │
│                                                             │
│  ┌──────────────┐  ┌────────────────────────────────── ┐    │
│  │    Models    │  │         Adapters                  │    │
│  │  (Unificado) │  │                                   │    │
│  │              │  │  BaseAdapter (abstracto)          │    │
│  │     User     │  │         ▲                         │    │
│  └──────────────┘  │  ┌──────┴──────┬──────┬──────┐    │    │
│                    │  │             │      │      │    │    │
│                    │  Github   Internal  JSON  Twitter │    │
│                    │  Adapter  Adapter  Adapter Adapter│    │
│                    └────────────────────────────────── ┘    │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Principales

#### 1. **Core Layer** (`src/app/core/`)

- **`models/user.ts`**: Modelo unificado `User` que todos los adapters producen
- **`adapters/base.adapter.ts`**: Clase abstracta con utilidades compartidas (validación, sanitización, parseo)
- **`adapters/*-user.adapter.ts`**: Adaptadores concretos para cada fuente de datos

#### 2. **Features Layer** (`src/app/features/user-management/`)

- **`services/user-data.ts`**: Servicio orquestador que coordina los adapters
- **`models/*-user.ts`**: DTOs específicos de cada API externa
- **`components/`**: Componentes de UI que consumen el modelo unificado

#### 3. **App Layer** (`src/app/`)

- Configuración de la aplicación y componente raíz

### Implementación del Patrón

#### Paso 1: Modelo Unificado

Todos los adapters transforman hacia este modelo común:

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

#### Paso 2: Clase Base con Utilidades

Métodos compartidos que todos los adapters pueden usar:

```typescript
// src/app/core/adapters/base.adapter.ts
export abstract class BaseAdapter {
  protected static isValidEmail(email: string): boolean { /* ... */
  }

  protected static parseDateSafely(dateString: string): Date | null { /* ... */
  }

  protected static sanitizeText(text: string, maxLength?: number): string { /* ... */
  }

  protected static requireField(value: any, field: string, adapter: string): void { /* ... */
  }

  protected static normalizeEmail(email: string): string { /* ... */
  }

  // ... más utilidades
}
```

#### Paso 3: Adapters Concretos

Cada fuente tiene su adapter que hereda de `BaseAdapter`:

```typescript
// src/app/core/adapters/github-user.adapter.ts
export class GithubUserAdapter extends BaseAdapter {
  static adapt(dto: GithubUserDto): User {
    // 1. Validar campos requeridos
    this.requireField(dto, 'dto', 'GithubUserAdapter');
    this.requireField(dto.id, 'id', 'GithubUserAdapter');

    // 2. Transformar al modelo unificado
    return {
      id: dto.id,
      name: this.resolveName(dto.name, dto.login),
      email: this.resolveEmail(dto.email, dto.login),
      avatar: this.resolveAvatar(dto.avatar_url),
      joinedDate: this.parseDateSafely(dto.created_at),
      source: 'github',
    };
  }

  // Métodos helper privados...
}
```

#### Paso 4: Orquestación

El servicio coordina todos los adapters:

```typescript
// src/app/features/user-management/services/user-data.ts
@Injectable()
export class UserData {
  private users = signal<User[]>([]);
  readonly allUsers = this.users.asReadonly();

  loadMockData(): void {
    const adaptedUsers: User[] = [];
    const errorList: string[] = [];

    // Cada fuente se procesa independientemente
    this.adaptWithErrorHandling(githubData, GithubUserAdapter, 'GitHub', adaptedUsers, errorList);
    this.adaptWithErrorHandling(internalData, InternalUserAdapter, 'Internal', adaptedUsers, errorList);
    this.adaptWithErrorHandling(jsonData, JsonAdapter, 'JSON', adaptedUsers, errorList);
    this.adaptWithErrorHandling(twitterData, TwitterAdapter, 'Twitter', adaptedUsers, errorList);

    // Actualizar estado
    this.users.set(adaptedUsers);
  }
}
```

### Manejo de Errores

El sistema implementa manejo de errores en **3 niveles**:

1. **Nivel Adapter**: Valida datos y lanza errores descriptivos
2. **Nivel Service**: Captura errores y permite que otras fuentes continúen
3. **Nivel UI**: Muestra datos exitosos aunque haya fallos parciales

**Beneficio clave**: Un fallo en GitHub no impide mostrar usuarios de las otras fuentes.

### Principios SOLID Aplicados

- **S**ingle Responsibility: Cada adapter maneja solo una fuente
- **O**pen/Closed: Abierto a extensión (nuevos adapters), cerrado a modificación
- **L**iskov Substitution: Todos los adapters son intercambiables
- **I**nterface Segregation: Interfaces mínimas y enfocadas
- **D**ependency Inversion: Dependencia en abstracciones, no implementaciones

---

## 📦 Instalación y Uso

### Requisitos Previos

- **Node.js**: v18 o superior
- **npm**: v9 o superior

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd angular-adapter-pattern

# Instalar dependencias
npm install
```

### Comandos Disponibles

```bash
# Servidor de desarrollo (http://localhost:4200)
npm start

# Build de producción
npm run build

# Tests unitarios
npm test

# Formatear código
npx prettier --write .
```

### Estructura de Carpetas

```
src/app/
├── core/                          # Lógica central reutilizable
│   ├── adapters/                  # 🎯 Patrón Adapter
│   │   ├── base.adapter.ts        # Clase base abstracta
│   │   ├── github-user.adapter.ts
│   │   ├── internal-user.adapter.ts
│   │   ├── jsonplaceholder-user.adapter.ts
│   │   └── twitter-user.adapter.ts
│   └── models/
│       └── user.ts                # Modelo unificado
│
├── features/                      # Características de negocio
│   └── user-management/
│       ├── models/                # DTOs externos
│       ├── services/              # Orquestador
│       └── components/            # UI
│
└── app.ts                         # Componente raíz
```

---

## 🚀 Extender el Sistema

### Agregar una Nueva Fuente de Datos

Supongamos que quieres integrar **GitLab**. Sigue estos 4 pasos:

#### 1. Crear el DTO

Define la estructura de datos de GitLab:

```typescript
// src/app/features/user-management/models/gitlab-user.ts
export interface GitlabUserDto {
  id: number;
  username: string;
  name: string | null;
  email: string | null;
  avatar_url?: string;
  created_at: string;
}
```

#### 2. Crear el Adapter

Extiende `BaseAdapter` e implementa `adapt()`:

```typescript
// src/app/core/adapters/gitlab-user.adapter.ts
export class GitlabUserAdapter extends BaseAdapter {
  private static readonly ADAPTER_NAME = 'GitlabUserAdapter';
  private static readonly DEFAULT_AVATAR = 'default-avatar.svg';

  static adapt(dto: GitlabUserDto): User {
    // Validación
    this.requireField(dto, 'dto', this.ADAPTER_NAME);
    this.requireField(dto.id, 'id', this.ADAPTER_NAME);
    this.requireField(dto.username, 'username', this.ADAPTER_NAME);

    // Transformación
    return {
      id: dto.id,
      name: this.resolveName(dto.name, dto.username),
      email: this.resolveEmail(dto.email, dto.username),
      avatar: this.resolveAvatar(dto.avatar_url),
      joinedDate: this.parseDateSafely(dto.created_at),
      source: 'gitlab', // ⚠️ Agregar a User.source
    };
  }

  // Métodos helper...
}
```

#### 3. Actualizar el Modelo User

Agrega la nueva fuente al tipo union:

```typescript
// src/app/core/models/user.ts
export interface User {
  // ...
  source: 'internal' | 'github' | 'jsonplaceholder' | 'twitter' | 'gitlab';
}
```

#### 4. Integrar en el Servicio

Úsalo en el orquestador:

```typescript
// src/app/features/user-management/services/user-data.ts
loadMockData()
:
void {
  const gitlabData
:
GitlabUserDto[] = [ /* ... */];

this.adaptWithErrorHandling(
  gitlabData,
  GitlabUserAdapter,
  'GitLab',
  adaptedUsers,
  errorList
);
}
```

### ¡Listo! 🎉

La arquitectura te permitió:

- ✅ No modificar código existente (solo agregar)
- ✅ No tocar componentes ni templates
- ✅ Agregar la fuente de forma aislada
- ✅ Mantener el mismo manejo de errores

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [Angular Documentation](https://angular.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Patrones de Diseño

- [Refactoring Guru - Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [TypeScript Design Patterns](https://www.patterns.dev/posts/classic-design-patterns)

### Angular Features Modernas

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [Zoneless Change Detection](https://angular.dev/guide/experimental/zoneless)

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. Fork del proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

**Proyecto creado con fines educativos para demostrar la aplicación del Patrón Adapter en Angular** 🚀
