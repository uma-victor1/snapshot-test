
Write-Host "=== LambdaTest SmartUI Test Runner ===" -ForegroundColor Cyan
Write-Host ""

# Function to load .env file
function Import-EnvFile {
    param (
        [string]$EnvFilePath = ".env"
    )
    
    if (Test-Path $EnvFilePath) {
        Write-Host "Loading credentials from .env file..." -ForegroundColor Yellow
        
        Get-Content $EnvFilePath | ForEach-Object {
            if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim()
                
                # Remove quotes if present
                $value = $value -replace '^["'']|["'']$', ''
                
                # Set environment variable
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
                Write-Host "  ✓ Loaded $name" -ForegroundColor Green
            }
        }
        
        Write-Host "Credentials loaded successfully." -ForegroundColor Green
        Write-Host ""
        return $true
    }
    else {
        Write-Host "ERROR: .env file not found!" -ForegroundColor Red
        Write-Host "Please copy .env.example to .env and add your credentials." -ForegroundColor Yellow
        return $false
    }
}

# Load environment variables
if (-not (Load-EnvFile)) {
    exit 1
}

# Validate credentials are set
$LT_USERNAME = [Environment]::GetEnvironmentVariable("LT_USERNAME", "Process")
$LT_ACCESS_KEY = [Environment]::GetEnvironmentVariable("LT_ACCESS_KEY", "Process")

if ([string]::IsNullOrWhiteSpace($LT_USERNAME)) {
    Write-Host "ERROR: LT_USERNAME not set in .env file" -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrWhiteSpace($LT_ACCESS_KEY)) {
    Write-Host "ERROR: LT_ACCESS_KEY not set in .env file" -ForegroundColor Red
    exit 1
}

Write-Host "Running SmartUI tests..." -ForegroundColor Cyan
npm test

Write-Host ""
Write-Host "Tests completed." -ForegroundColor Green