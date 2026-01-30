# Deployment script for Ubuntu Server
# This script transfers compiled files to the Ubuntu server

# IMPORTANT: Configure these variables in your environment or pass them as parameters
# DO NOT commit real values to the repository

param(
    [string]$ServerIP = $env:DEPLOY_SERVER_IP,
    [string]$ServerUser = $env:DEPLOY_SERVER_USER,
    [string]$RemotePath = $env:DEPLOY_REMOTE_PATH,
    [int]$ServerPort = $env:DEPLOY_SERVER_PORT,
    [switch]$SkipBuild = $false
)

# Default values if not set in environment variables
if (-not $ServerIP) { $ServerIP = "YOUR_SERVER_IP" }
if (-not $ServerUser) { $ServerUser = "YOUR_USERNAME" }
if (-not $RemotePath) { $RemotePath = "/var/www/base-angular-app" }
if (-not $ServerPort) { $ServerPort = 4200 }

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Angular Deployment to Ubuntu       " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Build step
if (-not $SkipBuild) {
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "  STEP 1: Building Application      " -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Running: ng build --configuration production" -ForegroundColor Yellow
    Write-Host ""

    # Check if ng command is available
    try {
        $ngVersion = ng version 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Angular CLI not found"
        }
    } catch {
        Write-Host "ERROR: Angular CLI not found. Install it with:" -ForegroundColor Red
        Write-Host "  npm install -g @angular/cli" -ForegroundColor Yellow
        exit 1
    }

    # Run the build
    ng build --configuration production

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: Build failed. Fix the errors and try again." -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "OK Build completed successfully" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Skipping build step (--SkipBuild flag enabled)" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  STEP 2: Preparing Deployment       " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if dist/base-angular-app/browser folder exists
$browserPath = ".\dist\base-angular-app\browser"
if (-not (Test-Path $browserPath)) {
    Write-Host "Error: Folder $browserPath not found" -ForegroundColor Red
    Write-Host "Run 'ng build --configuration production' first." -ForegroundColor Red
    exit 1
}

# Validate configuration
if ($ServerIP -eq "YOUR_SERVER_IP" -or $ServerUser -eq "YOUR_USERNAME") {
    Write-Host "Error: You must configure environment variables or pass parameters:" -ForegroundColor Red
    Write-Host "  DEPLOY_SERVER_IP=your_ip" -ForegroundColor Yellow
    Write-Host "  DEPLOY_SERVER_USER=your_username" -ForegroundColor Yellow
    Write-Host "  DEPLOY_REMOTE_PATH=/var/www/base-angular-app" -ForegroundColor Yellow
    Write-Host "  DEPLOY_SERVER_PORT=4200" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use parameters:" -ForegroundColor Yellow
    Write-Host "  .\deploy.ps1 -ServerIP '192.168.1.100' -ServerUser 'user'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Server: ${ServerIP}:${ServerPort}" -ForegroundColor Yellow
Write-Host "User: $ServerUser" -ForegroundColor Yellow
Write-Host "Remote path: $RemotePath" -ForegroundColor Yellow
Write-Host ""

# Show current build timestamp
if (Test-Path "$browserPath\index.html") {
    $buildTime = (Get-Item "$browserPath\index.html").LastWriteTime
    Write-Host "Current build timestamp: $buildTime" -ForegroundColor Yellow
    if (-not $SkipBuild) {
        Write-Host "Files are fresh from recent build" -ForegroundColor Green
    } else {
        $timeDiff = (Get-Date) - $buildTime
        if ($timeDiff.TotalMinutes -gt 30) {
            Write-Host "WARNING: Build is older than 30 minutes." -ForegroundColor Red
            $response = Read-Host "Continue anyway? (y/n)"
            if ($response -ne 'y') {
                Write-Host "Deployment cancelled by user" -ForegroundColor Yellow
                exit 0
            }
        }
    }
}
Write-Host ""

# Check if SCP is available
try {
    $scpVersion = scp 2>&1
    Write-Host "OK SCP available" -ForegroundColor Green
} catch {
    Write-Host "ERROR SCP not available. Install OpenSSH Client from Windows Settings." -ForegroundColor Red
    Write-Host "  Settings > Apps > Optional Features > OpenSSH Client" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  STEP 3: Transferring Files         " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Compress files from browser subdirectory
Write-Host "[3.1] Compressing files from browser/..." -ForegroundColor Yellow
$zipFile = ".\dist\app.zip"
Compress-Archive -Path "$browserPath\*" -DestinationPath $zipFile -Force

if (Test-Path $zipFile) {
    Write-Host "OK Files compressed successfully" -ForegroundColor Green
} else {
    Write-Host "ERROR Failed to compress files" -ForegroundColor Red
    exit 1
}

# Transfer compressed file to server
Write-Host ""
Write-Host "[3.2] Transferring files to server..." -ForegroundColor Yellow
Write-Host "Enter server password when prompted" -ForegroundColor Cyan

scp $zipFile "${ServerUser}@${ServerIP}:/tmp/app.zip"

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Files transferred successfully" -ForegroundColor Green
} else {
    Write-Host "ERROR Failed to transfer files" -ForegroundColor Red
    Remove-Item $zipFile -Force
    exit 1
}

# Decompress on server
Write-Host ""
Write-Host "[3.3] Decompressing and deploying files on server..." -ForegroundColor Yellow
Write-Host "You will be prompted for sudo password..." -ForegroundColor Cyan
Write-Host ""

# Extract to temp directory first (no sudo needed)
Write-Host "  - Extracting files to temp directory..." -ForegroundColor Gray
ssh "${ServerUser}@${ServerIP}" "mkdir -p ~/temp-deploy && rm -rf ~/temp-deploy/* && unzip -q /tmp/app.zip -d ~/temp-deploy"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR Failed to extract files" -ForegroundColor Red
    exit 1
}

# Deploy with sudo (will prompt for password)
Write-Host "  - Stopping Nginx..." -ForegroundColor Gray
Write-Host "  - Cleaning deployment directory..." -ForegroundColor Gray
Write-Host "  - Copying files to $RemotePath..." -ForegroundColor Gray
Write-Host "  - Setting permissions..." -ForegroundColor Gray
Write-Host "  - Starting Nginx..." -ForegroundColor Gray

ssh -t "${ServerUser}@${ServerIP}" @"
sudo systemctl stop nginx && \
sudo mkdir -p $RemotePath && \
sudo rm -rf $RemotePath/* && \
sudo cp -r ~/temp-deploy/* $RemotePath/ && \
sudo chown -R www-data:www-data $RemotePath && \
sudo chmod -R 755 $RemotePath && \
sudo systemctl reload nginx && \
sudo systemctl restart nginx && \
echo 'Deployment completed - Nginx restarted'
"@

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR Failed during deployment" -ForegroundColor Red
    exit 1
}

# Clean up temp files
Write-Host "  - Cleaning up..." -ForegroundColor Gray
ssh "${ServerUser}@${ServerIP}" "rm -rf ~/temp-deploy && rm -f /tmp/app.zip"

Write-Host ""
Write-Host "OK Deployment completed successfully" -ForegroundColor Green
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  STEP 4: VERIFICATION               " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1] Files in deployment directory:" -ForegroundColor Yellow
ssh "${ServerUser}@${ServerIP}" "ls -lh $RemotePath"
Write-Host ""
Write-Host "[2] Checking Nginx configuration:" -ForegroundColor Yellow
ssh "${ServerUser}@${ServerIP}" "sudo nginx -T 2>&1 | grep -A 5 'root\s*/var/www' | head -n 10"
Write-Host ""
Write-Host "[3] Nginx status:" -ForegroundColor Yellow
ssh "${ServerUser}@${ServerIP}" "sudo systemctl status nginx --no-pager -l | head -n 5"
Write-Host ""
Write-Host "[4] Recent file modification times:" -ForegroundColor Yellow
ssh "${ServerUser}@${ServerIP}" "ls -lt $RemotePath | head -n 5"
Write-Host ""
Write-Host "[5] index.html content check (first 5 lines):" -ForegroundColor Yellow
ssh "${ServerUser}@${ServerIP}" "head -n 5 $RemotePath/index.html"

# Clean local zip file
Remove-Item $zipFile -Force

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Your application should be available at:" -ForegroundColor Cyan
Write-Host "http://${ServerIP}:${ServerPort}" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
