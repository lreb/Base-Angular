# Script to load environment variables from .env file
# Usage: . .\set-env.ps1

param(
    [string]$EnvFile = ".\.env"
)

if (-not (Test-Path $EnvFile)) {
    Write-Host "Error: File $EnvFile not found" -ForegroundColor Red
    Write-Host "Copy .env.example to .env and configure your values" -ForegroundColor Yellow
    exit 1
}

Write-Host "Loading environment variables from $EnvFile..." -ForegroundColor Cyan

Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        Write-Host "OK $name configured" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Environment variables loaded successfully" -ForegroundColor Green
Write-Host ""
Write-Host "Configured values:" -ForegroundColor Cyan
Write-Host "  DEPLOY_SERVER_IP    : $env:DEPLOY_SERVER_IP" -ForegroundColor Yellow
Write-Host "  DEPLOY_SERVER_USER  : $env:DEPLOY_SERVER_USER" -ForegroundColor Yellow
Write-Host "  DEPLOY_REMOTE_PATH  : $env:DEPLOY_REMOTE_PATH" -ForegroundColor Yellow
Write-Host "  DEPLOY_SERVER_PORT  : $env:DEPLOY_SERVER_PORT" -ForegroundColor Yellow
Write-Host ""
Write-Host "You can now run: .\deploy.ps1" -ForegroundColor Green
