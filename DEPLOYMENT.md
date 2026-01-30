# Guía de Despliegue - Base Angular App

Esta guía te ayudará a desplegar la aplicación Angular en tu servidor Ubuntu 24.

## ⚠️ Seguridad

**IMPORTANTE**: Este proyecto usa variables de entorno para manejar información sensible. Nunca commitees:
- Archivos `.env` con valores reales
- IPs, usuarios o contraseñas directamente en los scripts
- Logs con información sensible

## Prerrequisitos

### En Windows (tu laptop)
- OpenSSH Client instalado
  - Ve a: Configuración > Aplicaciones > Características opcionales
  - Busca "Cliente OpenSSH" e instálalo si no está presente

### En Ubuntu Server
```bash
# Instalar Nginx
sudo apt update
sudo apt install nginx unzip -y

# Verificar que Nginx esté corriendo
sudo systemctl status nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Permitir puerto 4200 en el firewall
sudo ufw allow 4200/tcp
sudo ufw reload
```

## Configuración Inicial

### Paso 1: Configurar Variables de Entorno

```powershell
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores reales
notepad .env
```

Contenido del `.env`:
```
DEPLOY_SERVER_IP=192.168.100.142
DEPLOY_SERVER_USER=your_username
DEPLOY_REMOTE_PATH=/var/www/base-angular-app
DEPLOY_SERVER_PORT=4200
```

### Paso 2: Cargar Variables de Entorno

```powershell
# Cargar variables
. .\set-env.ps1
```

## Despliegue Automático

### Compilar y Desplegar
```powershell
# 1. Compilar
ng build --configuration production

# 2. Cargar variables (si aún no lo hiciste)
. .\set-env.ps1

# 3. Desplegar
.\deploy.ps1
```

### O Especificar Parámetros Directamente
```powershell
.\deploy.ps1 -ServerIP "192.168.100.142" -ServerUser "admin" -ServerPort 4200
```

## Despliegue Manual

### Paso 1: Compilar el proyecto
```powershell
ng build --configuration production
```

**Nota**: Angular 19 genera los archivos en `dist/base-angular-app/browser/`

### Paso 2: Transferir archivos al servidor
```powershell
# Comprimir archivos desde browser/
cd dist
Compress-Archive -Path "base-angular-app/browser/*" -DestinationPath app.zip -Force

# Transferir al servidor (reemplaza con tus valores)
scp app.zip your_user@your_server_ip:/tmp/

cd ..
```

### Paso 3: Configurar en el servidor
```bash
# Conectarse al servidor
ssh your_user@your_server_ip

# Crear directorio
sudo mkdir -p /var/www/base-angular-app

# Limpiar y descomprimir
sudo rm -rf /var/www/base-angular-app/*
sudo unzip /tmp/app.zip -d /var/www/base-angular-app

# Establecer permisos
sudo chown -R www-data:www-data /var/www/base-angular-app
sudo chmod -R 755 /var/www/base-angular-app

# Lrear/editar configuración de nginx
sudo nano /etc/nginx/sites-available/base-angular-app

# Pegar el contenido del archivo nginx.conf del proyecto
# IMPORTANTE: Reemplaza YOUR_SERVER_IP y YOUR_API_SERVER_IP con tus valores

# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/base-angular-app /etc/nginx/sites-enabled/

# Eliminar sitio por defecto (opcional)
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl status nginx

# Verificar que está escuchando en el puerto 4200
sudo ss -tulpn | grep :4200
```

## Verificación

### Verificar archivos en el servidor
```bash
ssh your_user@your_server_ip
ls -la /var/www/base-angular-app
# Debe mostrar: index.html, main-*.js, chunk-*.js, styles-*.css, etc.
```

### Verificar Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/base-angular-app.error.log
```

### Probar la aplicación
Abre tu navegador y ve a:
```
http://your_server_ip:4200
```

### Probar la aplicación
Abre tu navegador y ve a:
```
http://192.168.100.142
```

## Configuración del Firewall (si es necesario)

```bash
# Permitir tráfico HTTP
sudo ufw allow 'Nginx HTTP'

# O si usas firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

## Logs de Nginx

```bash
# Ver logs de acceso
sudSolución de Problemas

### Error: No se encontró la carpeta browser
Angular 19 genera archivos en `dist/base-angular-app/browser/`. Asegúrate de:
```powershell
# Verificar que existe
ls dist/base-angular-app/browser/
```

### Error 403 Forbidden
```bash
# Verificar permisos
sudo chmod -R 755 /var/www/base-angular-app
sudo chown -R www-data:www-data /var/www/base-angular-app

# Verificar que SELinux no está bloqueando (si aplica)
sudo setenforce 0
```

### Error 404 en rutas de Angular
Asegúrate de que el archivo `nginx.conf` tenga:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Nginx no escucha en puerto 4200
```bash
# Verificar configuración
sudo nginx -t

# Ver puertos en uso
sudo ss -tulpn | grep nginx

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs
Crea un archivo `quick-deploy.ps1`:

```powershell
# quick-deploy.ps1
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Deploy Rápido - Base Angular App  " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Compilar
Write-Host "[1/3] Compilando..." -ForegroundColor Yellow
ng build --configuration production

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Error en compilación" -ForegroundColor Red
    exit 1
}

# 2. Cargar variables
Write-Host ""
Wri✅ Usar variables de entorno para datos sensibles
2. ✅ Configurar puerto 4200 en Nginx
3. 🔲 Configurar HTTPS con Let's Encrypt
4. 🔲 Configurar CI/CD con GitHub Actions
5. 🔲 Implementar monitoreo
6. 🔲 Configurar backups automáticos

## Archivos del Proyecto

- **`.env.example`**: Plantilla de configuración (commitear)
- **`.env`**: Configuración real (NO commitear)
- **`set-env.ps1`**: Script para cargar variables
- **`deploy.ps1`**: Script de despliegue
- **`nginx.conf`**: Configuración de Nginx (sin IPs hardcodeadas)
- **`quick-deploy.ps1`**: Script de despliegue rápido (crear manualmente)

## URLs y Referencias

- **Aplicación**: `http://YOUR_SERVER_IP:4200`
- **API**: `http://YOUR_API_SERVER_IP/api/v1`
- **Swagger**: `http://YOUR_API_SERVER_IP/swagger/v1/swagger.json`

## Notas Importantes

⚠️ **Seguridad**:
- Nunca commitees archivos `.env` con valores reales
- Usa SSH keys en lugar de contraseñas para producción
- Mantén tus dependencias actualizadas
- Configura HTTPS para producción

📝 **Angular 19**:
- Los archivos se generan en `dist/base-angular-app/browser/`
- Asegúrate de comprimir desde el subdirectorio `browser/`

🔧 **Nginx**:
- Usa puerto 4200 (o el que prefieras)
- Configura `try_files` para Angular routing
- Habilita compresión gzip para mejor rendimiento
```

Ejecutar:
```powershell
.\quick-deploy.ps1
```

## Seguridad Adicional

### Proteger archivos sensibles
```powershell
# Nunca commitees estos archivos
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### Usar SSH Keys en lugar de contraseñas
```powershell
# En Windows, generar clave SSH
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copiar clave al servidor
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh user@server "cat >> ~/.ssh/authorized_keys"
```

### Configurar HTTPS (Producción)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado (requiere dominio)
sudo certbot --nginx -d your-domain.com
### La API no responde
1. Edita `nginx.conf` y descomenta la sección de proxy
2. Reemplaza `YOUR_API_SERVER_IP` con la IP real de tu API
3. Reinicia Nginx: `sudo systemctl restart nginx`

Luego solo ejecuta:
```powershell
.\quick-deploy.ps1
```

## Próximos Pasos

1. Configurar HTTPS con Let's Encrypt
2. Configurar CI/CD con GitHub Actions
3. Implementar monitoreo con PM2 o similar
4. Configurar backups automáticos

## URLs Importantes

- **Aplicación**: http://192.168.100.142
- **API**: http://192.168.100.142/api/v1
- **Swagger**: http://192.168.100.142/swagger/v1/swagger.json
