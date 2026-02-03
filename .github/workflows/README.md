# GitHub Actions Workflows

Este directorio contiene los workflows de CI/CD para el proyecto Base Angular App.

## 📁 Workflows Disponibles

### 1. `ci.yml` - Continuous Integration
**Ejecuta:** En cada push o pull request a `main` o `develop`

**Tareas:**
- ✅ Instala dependencias
- 🔍 Lint del código (si está configurado)
- 🧪 Ejecuta tests
- 🏗️ Construye la aplicación para producción
- 📊 Muestra información del build
- 📦 Genera artifacts (dist + deployment package)
- 💾 Guarda artifacts por 30 días

**Artifacts generados:**
- `angular-app-dist-{sha}`: Carpeta dist completa
- `deployment-package-{sha}`: ZIP listo para desplegar

### 2. `deploy.yml` - Prepare Release
**Ejecuta:** 
- Manualmente desde GitHub Actions UI
- Automáticamente al crear un tag (v1.0.0, v2.1.0, etc.)

**Tareas:**
- 🏗️ Build de producción
- 📦 Genera paquetes TAR.GZ y ZIP
- 🔐 Crea checksums SHA256
- 📋 Incluye nginx.conf
- 🚀 Crea GitHub Release (si es un tag)
- 💾 Guarda artifacts por 90 días

## 🔐 Configuración (Opcional)

Los workflows de CI funcionan sin configuración adicional. No necesitas configurar secrets a menos que quieras automatizar despliegues a servicios específicos.

### Para Auto-Deploy (Opcional)

Si quieres desplegar automáticamente a servicios cloud, puedes agregar secrets según el servicio:

**Digital Ocean:**
- `DO_API_TOKEN`: Token de API de Digital Ocean

**AWS:**
- `AWS_ACCESS_KEY_ID`: Access Key de AWS
- `AWS_SECRET_ACCESS_KEY`: Secret Key de AWS
- `AWS_REGION`: Región (ej: us-east-1)

**Azure:**
- `AZURE_CREDENTIALS`: JSON con credenciales de service principal

**Vercel/Netlify:**
- Conecta directamente desde su dashboard (no requiere secrets)

## 🚀 Cómo Usar

### Ejecutar Tests Automáticamente
```bash
# Los tests se ejecutan automáticamente en cada push/PR
git push origin develop
```

### Desplegar Manualmente
1. Ve a la pestaña "Actions" en GitHub
2. Selecciona "CD - Deploy to Server"
3. Click en "Run workflow"
4. Selecciona la rama y confirma

### Desplegar Automáticamente
```bash
# Simplemente haz push a main
git push origin main
```1. Crear Pull Request (Desarrollo)
```bash
# Crea una rama feature
git checkout -b feature/nueva-funcionalidad

# Haz tus cambios y commity un resumen al final
- Recibirás notificaciones por email si algún workflow falla
- Los artifacts se pueden descargar desde la página del workflow

## 🌐 Opciones de Deployment

Ver [DEPLOYMENT-CLOUD.md](../../DEPLOYMENT-CLOUD.md) para guías detalladas de deployment en:

- 🌊 **Digital Ocean** (App Platform o Droplet)
- ☁️ **AWS S3 + CloudFront**
- 🔷 **Azure Static Web Apps**
- ▲ **Vercel** (recomendado para simplicidad)
- 🌐 **Netlify**
- 📄 **GitHub Pages** (gratis para repos públicos)

## 🔧 Troubleshooting

### Los tests fallan en GitHub pero pasan localmente
- Verifica que no dependas de configuraciones locales
- Asegúrate de que todos los assets de test estén en el repo
- Revisa las versiones de Node.js (workflow usa 20.x)

### Build falla
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs en la pestaña Actions
- Prueba el build localmente: `npm ci && npm run build`

### No se generan artifacts
- Verifica que el build complete exitosamente
- Los artifacts solo se generan si todos los pasos anteriores pasan
- Artifacts de CI duran 30 días, artifacts de release duran 90 días

### Error al crear Release
- Solo se crean releases automáticas para tags que empiecen con "v"
- Verifica que tengas permisos de escritura en el repo
- El token `GITHUB_TOKEN` debe tener permiso para crear releases

## 📝 Notas

- **Artifacts de CI**: Se mantienen por 30 días
- **Artifacts de Release**: Se mantienen por 90 días
- **GitHub Releases**: Permanentes (hasta que se borren manualmente)
- Los workflows de CI se ejecutan en pull requests sin acceso a secrets (por seguridad)
- El deployment es siempre manual o mediante releases para mejor control
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

Esto:
- 🏗️ Construye la aplicación
- 📦 Crea paquetes de deployment
- 🚀 Genera un GitHub Release con todos los assets
- 📋 Incluye instrucciones de deploy para cada plataforma

### 4. Descargar y Desplegar

**Opción A: Desde GitHub Release (para tags)**
1. Ve a la sección "Releases" en GitHub
2. Descarga el archivo que necesites:
   - `.tar.gz` para Linux/Mac
   - `.zip` para Windows
3. Sigue las instrucciones de deployment en [DEPLOYMENT-CLOUD.md](../../DEPLOYMENT-CLOUD.md)

**Opción B: Desde Artifacts (cualquier commit)**
1. Ve a la pestaña "Actions" en GitHub
2. Selecciona el workflow ejecutado
3. Descarga el artifact `deployment-package-{sha}`
4. Úsalo para desplegar en tu servicio cloud preferido

### 5. Deploy Manual (sin tag)
```bash
# Ejecuta el workflow manualmente
# Ve a Actions → CD - Prepare Release → Run workflow
# Especifica una versión (ej: v1.1.0-beta) de tu archivo `nginx.conf`
- Ejecuta `sudo nginx -t` en el servidor para verificar

### Build falla
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs en la pestaña Actions para más detalles

## 📝 Notas

- Los artifacts de build se mantienen por 7 días
- Cada despliegue crea un backup automático con timestamp
- El workflow de CI no despliega, solo valida el código
- El workflow de CD requiere que CI pase exitosamente
