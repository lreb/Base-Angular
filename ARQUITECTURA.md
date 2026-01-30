# Base Angular App - Proyecto Escalable y Modular

Proyecto Angular con arquitectura escalable, mantenible y testeable, utilizando NgRx para el manejo de estado.

## 🎯 Características

- **Escalable**: Fácil agregar nuevos features sin afectar el código existente
- **Mantenible**: Código organizado y predecible siguiendo mejores prácticas
- **Testeable**: Separación clara de responsabilidades
- **NgRx**: Estado centralizado y predecible con Store, Effects y Selectors
- **TypeScript**: Seguridad de tipos en toda la aplicación
- **Modular**: Cada feature es independiente y auto-contenido

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                   # Servicios y funcionalidades core
│   │   ├── guards/            # Guards de navegación
│   │   ├── interceptors/      # HTTP interceptors
│   │   ├── models/            # Interfaces y tipos compartidos
│   │   └── services/          # Servicios singleton
│   │
│   ├── features/              # Features modulares de la aplicación
│   │   └── home/              # Ejemplo de feature
│   │       ├── components/    # Componentes del feature
│   │       ├── store/         # Estado NgRx del feature
│   │       │   ├── *.actions.ts
│   │       │   ├── *.reducer.ts
│   │       │   ├── *.selectors.ts
│   │       │   └── *.effects.ts
│   │       └── *.component.ts
│   │
│   ├── shared/                # Componentes, directivas y pipes compartidos
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   │
│   ├── store/                 # Configuración global del store
│   │   └── index.ts          # Root state y reducers
│   │
│   ├── app.config.ts         # Configuración de la aplicación
│   ├── app.routes.ts         # Rutas principales
│   └── app.ts                # Componente raíz
│
└── environments/              # Configuraciones de entorno
    ├── environment.ts
    └── environment.prod.ts
```

## 🚀 Comenzar

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Angular CLI (`npm install -g @angular/cli`)

### Instalación

```bash
# Las dependencias ya están instaladas
cd base-angular-app

# Ejecutar el proyecto en desarrollo
ng serve

# O con npm
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🧩 Crear un Nuevo Feature

Para mantener la consistencia, sigue estos pasos al crear un nuevo feature:

### 1. Crear la estructura de carpetas

```bash
# Crear directorios del feature
mkdir -p src/app/features/mi-feature/components
mkdir -p src/app/features/mi-feature/store
```

### 2. Crear el Store (NgRx)

```typescript
// mi-feature.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadData = createAction('[Mi Feature] Load Data');
export const loadDataSuccess = createAction(
  '[Mi Feature] Load Data Success',
  props<{ data: any }>()
);
export const loadDataFailure = createAction(
  '[Mi Feature] Load Data Failure',
  props<{ error: any }>()
);
```

```typescript
// mi-feature.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as MiFeatureActions from './mi-feature.actions';

export interface MiFeatureState {
  data: any | null;
  loading: boolean;
  error: any | null;
}

export const initialState: MiFeatureState = {
  data: null,
  loading: false,
  error: null
};

export const miFeatureReducer = createReducer(
  initialState,
  on(MiFeatureActions.loadData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  // ... más handlers
);
```

```typescript
// mi-feature.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MiFeatureState } from './mi-feature.reducer';

export const selectMiFeatureState = createFeatureSelector<MiFeatureState>('miFeature');

export const selectData = createSelector(
  selectMiFeatureState,
  (state) => state.data
);
```

```typescript
// mi-feature.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as MiFeatureActions from './mi-feature.actions';

@Injectable()
export class MiFeatureEffects {
  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MiFeatureActions.loadData),
      switchMap(() =>
        // Tu servicio HTTP aquí
        of({ data: 'ejemplo' }).pipe(
          map(data => MiFeatureActions.loadDataSuccess({ data })),
          catchError(error => of(MiFeatureActions.loadDataFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions) {}
}
```

### 3. Registrar en el Store Global

```typescript
// src/app/store/index.ts
import { miFeatureReducer, MiFeatureState } from '../features/mi-feature/store';

export interface AppState {
  home: HomeState;
  miFeature: MiFeatureState; // Agregar aquí
}

export const reducers: ActionReducerMap<AppState> = {
  home: homeReducer,
  miFeature: miFeatureReducer // Agregar aquí
};
```

### 4. Registrar Effects

```typescript
// src/app/app.config.ts
import { MiFeatureEffects } from './features/mi-feature/store';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideEffects([HomeEffects, MiFeatureEffects]), // Agregar aquí
    // ...
  ]
};
```

### 5. Crear el Componente

```typescript
// mi-feature.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as MiFeatureActions from './store/mi-feature.actions';
import * as MiFeatureSelectors from './store/mi-feature.selectors';

@Component({
  selector: 'app-mi-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-feature.component.html',
  styleUrl: './mi-feature.component.css'
})
export class MiFeatureComponent {
  data$ = this.store.select(MiFeatureSelectors.selectData);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(MiFeatureActions.loadData());
  }
}
```

### 6. Agregar Rutas

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  // ...
  {
    path: 'mi-feature',
    loadComponent: () => import('./features/mi-feature/mi-feature.component')
      .then(m => m.MiFeatureComponent)
  }
];
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm start                 # Inicia el servidor de desarrollo

# Build
npm run build            # Build de producción
npm run build:dev        # Build de desarrollo

# Testing
npm test                 # Ejecuta tests unitarios
npm run test:coverage    # Tests con coverage

# Linting
npm run lint             # Ejecuta ESLint
```

## 📚 Convenciones y Mejores Prácticas

### Nombres de Archivos
- Componentes: `nombre.component.ts`
- Servicios: `nombre.service.ts`
- Guards: `nombre.guard.ts`
- Pipes: `nombre.pipe.ts`
- Directivas: `nombre.directive.ts`

### NgRx
- **Acciones**: Usar el formato `[Source] Event`
  - Ejemplo: `[Auth API] Login Success`
- **Efectos**: Un effect por acción compleja
- **Selectores**: Crear selectores específicos, evitar lógica en componentes
- **Reducers**: Mantener puros, sin side effects

### Componentes
- Usar componentes standalone
- Preferir OnPush change detection
- Separar lógica de presentación
- Usar async pipe en templates

### Servicios
- Servicios singleton en `core/services`
- Servicios de feature dentro del feature
- Inyección de dependencias en constructor

## 🧪 Testing

### Estructura de Tests
```
feature/
├── component.ts
├── component.spec.ts      # Tests del componente
└── store/
    ├── actions.spec.ts
    ├── reducer.spec.ts
    ├── selectors.spec.ts
    └── effects.spec.ts
```

### Ejemplo de Test

```typescript
describe('MiFeatureComponent', () => {
  let component: MiFeatureComponent;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MiFeatureComponent],
      providers: [provideMockStore()]
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(MiFeatureComponent);
    component = fixture.componentInstance;
  });

  it('should dispatch loadData on init', () => {
    spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(MiFeatureActions.loadData());
  });
});
```

## 📦 Dependencias Principales

- **Angular**: Framework principal (v19+)
- **@ngrx/store**: Manejo de estado
- **@ngrx/effects**: Side effects
- **@ngrx/router-store**: Integración de routing con store
- **@ngrx/store-devtools**: DevTools para debugging
- **TypeScript**: Lenguaje principal

## 🔧 Configuración

### Environments
Los archivos de environment se encuentran en `src/environments/`:
- `environment.ts`: Desarrollo
- `environment.prod.ts`: Producción

### Path Aliases (tsconfig.json)
```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@environments/*": ["src/environments/*"]
    }
  }
}
```

## 🎨 Estilos

El proyecto usa CSS puro. Los estilos globales están en:
- `src/styles.css`: Estilos globales
- Cada componente tiene su propio archivo CSS

## 🚢 Deployment

### Build de Producción
```bash
npm run build
# Los archivos se generan en dist/
```

### Variables de Entorno
Actualizar `environment.prod.ts` antes del deployment:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-production.com',
  // ...
};
```

## 📖 Recursos

- [Angular Documentation](https://angular.dev)
- [NgRx Documentation](https://ngrx.io)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contribuir

1. Crear una rama para tu feature: `git checkout -b feature/mi-feature`
2. Hacer commit de los cambios: `git commit -m 'Add mi feature'`
3. Push a la rama: `git push origin feature/mi-feature`
4. Crear un Pull Request

## 📝 Licencia

Este proyecto es un template inicial para proyectos Angular escalables.

---

**¡Happy coding! 🚀**
