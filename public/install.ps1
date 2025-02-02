# Configuration
$binaryUrl = "https://lokio.dev/install/windows.exe"
$installDir = "$env:ProgramFiles\Lokio"
$maxRetries = 3
$retryCount = 0

function Test-Command {
    param (
        [string]$Command
    )
    try {
        Get-Command $Command -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

function Add-ToPath {
    param (
        [string]$Directory
    )
    $currentPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)
    if ($currentPath -notlike "*$Directory*") {
        $newPath = "$currentPath;$Directory"
        [Environment]::SetEnvironmentVariable("Path", $newPath, [EnvironmentVariableTarget]::Machine)
        $env:Path = $newPath
        Write-Host "Added $Directory to PATH" -ForegroundColor Green
        return $true
    }
    return $false
}

try {
    # Create installation directory
    if (-Not (Test-Path $installDir)) {
        Write-Host "Creating installation directory..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $installDir -Force | Out-Null
    }

    # Configure TLS
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

    # Download with retry logic
    Write-Host "Downloading Lokio..." -ForegroundColor Yellow
    $ProgressPreference = 'SilentlyContinue'
    
    while ($retryCount -lt $maxRetries) {
        try {
            $webClient = New-Object System.Net.WebClient
            $webClient.DownloadFile($binaryUrl, "$installDir\lokio.exe")
            Write-Host "Download completed successfully!" -ForegroundColor Green
            break
        }
        catch {
            $retryCount++
            if ($retryCount -eq $maxRetries) {
                throw "Download failed after $maxRetries attempts. Error: $_"
            }
            Write-Host "Download attempt $retryCount failed. Retrying in 5 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        }
    }

    # Verify downloaded file
    if (-Not (Test-Path "$installDir\lokio.exe")) {
        throw "Installation failed - executable not found"
    }

    # Add to PATH
    Write-Host "Updating system PATH..." -ForegroundColor Yellow
    Add-ToPath -Directory $installDir

    # Refresh current session PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

    # Verify installation
    Write-Host "Verifying installation..." -ForegroundColor Yellow
    if (Test-Path "$installDir\lokio.exe") {
        Write-Host "Installation file verified!" -ForegroundColor Green
    } else {
        throw "Installation verification failed - executable not found"
    }

    # Test command availability
    Write-Host "Testing command availability..." -ForegroundColor Yellow
    if (Test-Command -Command "lokio") {
        Write-Host "Lokio command is available!" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Lokio command not immediately available. Please restart your terminal." -ForegroundColor Yellow
    }

    # Final verification and instructions
    Write-Host "`nInstallation completed!" -ForegroundColor Green
    Write-Host @"

Next steps:
1. Close and reopen your PowerShell terminal
2. Run 'lokio -v' to verify the installation
3. If the command is still not found, try running: & '$installDir\lokio.exe' -v

Installation Directory: $installDir
"@ -ForegroundColor Cyan

}
catch {
    Write-Host "`nInstallation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nTroubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Ensure you're running PowerShell as Administrator"
    Write-Host "2. Check your internet connection"
    Write-Host "3. Verify if the directory '$installDir' is accessible"
    Write-Host "4. Check if your antivirus is blocking the download"
    Write-Host "5. Try running the installation script again"
    exit 1
}