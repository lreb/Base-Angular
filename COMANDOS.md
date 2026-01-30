# 🛠️ Comandos Útiles - Base Angular App

## 🚀 Desarrollo

### Iniciar el servidor
```bash
npm start
# o
ng serve
```

### Iniciar con puerto específico
```bash
ng serve --port 4201
```

### Iniciar y abrir en navegador
```bash
ng serve --open
# o
ng serve -o
```

## 🏗️ Generación de Código

### Crear un nuevo componente
```bash
# Componente standalone
ng generate component features/mi-feature --standalone

# Componente con routing
ng generate component features/mi-feature --standalone --routing
```

### Crear un servicio
```bash
ng generate service core/services/mi-servicio

# En un feature específico
ng generate service features/mi-feature/services/mi-servicio
```

### Crear un guard
```bash
ng generate guard core/guards/mi-guard
```

### Crear una directiva
```bash
ng generate directive shared/directives/mi-directiva --standalone
```

### Crear un pipe
```bash
ng generate pipe shared/pipes/mi-pipe --standalone
```

### Crear un interceptor
```bash
ng generate interceptor core/interceptors/mi-interceptor
```

## 📦 NgRx

### Generar feature store completo
```bash
# Instalar NgRx schematics si no está instalado
npm install @ngrx/schematics --save-dev

# Generar feature con store
ng generate @ngrx/schematics:feature features/mi-feature/store/MiFeature --group
```

### Generar acciones
```bash
ng generate @ngrx/schematics:action features/mi-feature/store/MiFeature
```

### Generar reducer
```bash
ng generate @ngrx/schematics:reducer features/mi-feature/store/MiFeature
```

### Generar effects
```bash
ng generate @ngrx/schematics:effect features/mi-feature/store/MiFeature
```

### Generar selector
```bash
ng generate @ngrx/schematics:selector features/mi-feature/store/MiFeature
```

## 🧪 Testing

### Ejecutar tests
```bash
npm test
# o
ng test
```

### Tests con coverage
```bash
ng test --code-coverage
# o
ng test --no-watch --code-coverage
```

### Ejecutar tests de un archivo específico
```bash
ng test --include='**/mi-componente.spec.ts'
```

## 🏗️ Build

### Build de desarrollo
```bash
ng build
```

### Build de producción
```bash
ng build --configuration production
# o
npm run build
```

### Build con análisis de bundle
```bash
ng build --stats-json
# Luego analizar con:
npx webpack-bundle-analyzer dist/base-angular-app/stats.json
```

## 🔍 Análisis y Debugging

### Verificar proyecto
```bash
ng lint
```

### Formatear código (si tienes prettier)
```bash
npx prettier --write "src/**/*.{ts,html,css,scss}"
```

### Ver información del proyecto
```bash
ng version
```

### Analizar el bundle size
```bash
ng build --configuration production --stats-json
npx webpack-bundle-analyzer dist/base-angular-app/stats.json
```

## 📦 Dependencias

### Instalar dependencia
```bash
npm install nombre-paquete
```

### Instalar dependencia de desarrollo
```bash
npm install nombre-paquete --save-dev
```

### Actualizar dependencias
```bash
npm update
```

### Verificar dependencias obsoletas
```bash
npm outdated
```

### Actualizar Angular
```bash
ng update @angular/cli @angular/core
```

### Actualizar NgRx
```bash
ng update @ngrx/store @ngrx/effects @ngrx/entity @ngrx/router-store @ngrx/store-devtools
```

## 🧹 Limpieza

### Limpiar caché
```bash
npm cache clean --force
```

### Reinstalar node_modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Limpiar dist
```bash
rm -rf dist
```

## 🎨 Styling

### Generar estilos globales SCSS (si migras a SCSS)
```bash
ng config schematics.@schematics/angular:component.style scss
```

## 🔧 Configuración

### Ver configuración del proyecto
```bash
ng config
```

### Cambiar configuración
```bash
ng config projects.base-angular-app.architect.build.options.outputPath dist/nueva-ruta
```

## 📊 Performance

### Servidor con optimizaciones
```bash
ng serve --optimization
```

### Build con source maps
```bash
ng build --source-map
```

### Análisis de rendimiento
```bash
ng build --configuration production --stats-json
```

## 🚢 Deployment

### Build optimizado para producción
```bash
ng build --configuration production --output-path=dist
```

### Verificar tamaño de bundles
```bash
ng build --configuration production --stats-json
```

## 📝 Otros Comandos Útiles

### Abrir documentación de Angular
```bash
ng doc ComponentClass
```

### Ejecutar schematic personalizado
```bash
ng generate @angular/material:navigation nombre-nav
```

### Agregar capacidades
```bash
ng add @angular/material
ng add @angular/pwa
```

## 🐛 Debugging

### Modo verbose
```bash
ng serve --verbose
```

### Ver configuración de webpack
```bash
ng eject  # ⚠️ Cuidado: esto es irreversible
```

### Servidor con polling (útil en containers)
```bash
ng serve --poll=2000
```

## 📱 Progressive Web App (PWA)

### Agregar PWA
```bash
ng add @angular/pwa
```

## 🌐 i18n (Internacionalización)

### Extraer textos para traducción
```bash
ng extract-i18n
```

### Servir con idioma específico
```bash
ng serve --configuration=es
```

## 💡 Tips Rápidos

### Crear estructura de feature completa
```bash
# Crear directorios
mkdir -p src/app/features/mi-feature/{components,services,models,store}

# Generar componente
ng g c features/mi-feature --standalone

# Generar servicio
ng g s features/mi-feature/services/mi-feature

# Generar store
ng g @ngrx/schematics:feature features/mi-feature/store/MiFeature --group
```

### Alias útiles para package.json
```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "test": "ng test",
    "test:ci": "ng test --no-watch --code-coverage",
    "lint": "ng lint",
    "format": "prettier --write \"src/**/*.{ts,html,css}\"",
    "analyze": "ng build --configuration production --stats-json && webpack-bundle-analyzer dist/base-angular-app/stats.json"
  }
}
```

## 📚 Recursos

- [Angular CLI Documentation](https://angular.dev/cli)
- [NgRx CLI Documentation](https://ngrx.io/guide/schematics)
- [Angular DevTools](https://angular.dev/tools/devtools)

---

**Mantén este archivo como referencia rápida de comandos!** 📖
