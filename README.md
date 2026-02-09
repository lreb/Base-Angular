# Base Angular App - Proyecto Escalable 🚀

Proyecto Angular con arquitectura modular, escalable y mantenible, utilizando **NgRx** para el manejo de estado centralizado.

## ✨ Características Principales

- ✅ **Escalable**: Arquitectura modular que facilita agregar nuevos features
- 🔧 **Mantenible**: Código organizado siguiendo mejores prácticas
- 🧪 **Testeable**: Separación clara de responsabilidades
- 📦 **NgRx**: Manejo de estado centralizado con Store, Effects y Selectors
- 💎 **TypeScript**: Seguridad de tipos en toda la aplicación
- 🧩 **Modular**: Cada feature es independiente y auto-contenido
- 🎨 **CSS**: Estilos con CSS puro

## � Documentación Interactiva con DeepWiki

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lreb/Base-Angular)

¿Tienes preguntas sobre el código? Explora la **documentación generada automáticamente por DeepWiki**, una herramienta impulsada por IA que mantiene documentación actualizada y conversacional de todo el repositorio.

**[🔗 Accede a la Documentación DeepWiki](https://deepwiki.com/lreb/Base-Angular)**

### ¿Qué encontrarás en DeepWiki?

- **Arquitectura detallada**: Diagrams y explicaciones de los patrones de diseño
- **Gestión de Estado NgRx**: Guías completas sobre Actions, Reducers, Effects y Selectors
- **Estructura del Proyecto**: Navegación interactiva por módulos y componentes
- **Flujos de Desarrollo**: Cómo crear nuevos features paso a paso
- **Stack Tecnológico**: Detalles de todas las dependencias y configuraciones
- **Documentación Conversacional**: Pregunta lo que necesites sobre el código

La documentación se actualiza automáticamente con cada cambio en el repositorio (última actualización: 4 de febrero 2026).

## �🚀 Inicio Rápido

### Ejecutar en modo desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

### Build de producción

```bash
npm run build
```

Los archivos se generarán en `dist/`

## 📁 Estructura del Proyecto

```
src/app/
├── core/              # Servicios singleton y funcionalidades core
│   ├── guards/        # Guards de navegación
│   ├── interceptors/  # HTTP interceptors
│   ├── models/        # Interfaces y modelos
│   └── services/      # Servicios core
├── features/          # Features modulares
│   └── home/          # Ejemplo de feature con NgRx
│       ├── components/
│       └── store/     # Actions, Reducers, Selectors, Effects
├── shared/            # Componentes, directivas y pipes compartidos
├── store/             # Configuración global de NgRx
└── environments/      # Configuraciones de entorno
```

## 📚 Documentación Completa

Para información detallada sobre la arquitectura, convenciones y cómo crear nuevos features, consulta:

👉 **[ARQUITECTURA.md](./ARQUITECTURA.md)** - Guía completa de arquitectura y mejores prácticas

## 🛠️ Tecnologías

- **Angular** 19+ - Framework principal
- **@ngrx/store** - Manejo de estado
- **@ngrx/effects** - Side effects
- **@ngrx/router-store** - Integración routing con store
- **@ngrx/store-devtools** - DevTools para debugging
- **TypeScript** - Lenguaje principal
- **RxJS** - Programación reactiva

## 🎯 Crear un Nuevo Feature

Para crear un nuevo feature modular con NgRx, sigue la guía en [ARQUITECTURA.md](./ARQUITECTURA.md#-crear-un-nuevo-feature).

Pasos básicos:
1. Crear estructura de carpetas
2. Implementar Actions, Reducer, Selectors y Effects
3. Registrar en el store global
4. Crear componente
5. Agregar rutas

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Tests con coverage
npm run test:coverage
```

## 🔍 Linting

```bash
npm run lint
```

## 📖 Recursos

- [Documentación de Angular](https://angular.dev)
- [Documentación de NgRx](https://ngrx.io)
- [Arquitectura del Proyecto](./ARQUITECTURA.md)

---

**Proyecto creado con Angular CLI v21.0.2**

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
