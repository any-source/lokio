# URLs and paths
$BINARY_URL = "https://sh.lokio.dev/bin/lokio.exe"
$INSTALL_DIR = "$env:LOCALAPPDATA\Programs\Lokio"

# Helper functions for colored output
function Write-ColorText {
    param (
        [string]$Text,
        [string]$Color = "White",
        [switch]$NoNewline
    )
    
    if ($NoNewline) {
        Write-Host $Text -ForegroundColor $Color -NoNewline
    } else {
        Write-Host $Text -ForegroundColor $Color
    }
}

function Write-Step {
    param ([string]$Message)
    Write-ColorText "→ " -Color Cyan -NoNewline
    Write-ColorText $Message
}

function Write-Success {
    param ([string]$Message)
    Write-ColorText "✓ " -Color Green -NoNewline
    Write-ColorText $Message
}

function Write-Error {
    param ([string]$Message)
    Write-ColorText "✗ " -Color Red -NoNewline
    Write-ColorText $Message -Color Red
}

function Test-AdminPrivileges {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Install-LokioBinary {
    try {
        # Create installation directory
        Write-Step "Creating installation directory..."
        New-Item -ItemType Directory -Path $INSTALL_DIR -Force | Out-Null

        # Download binary
        Write-Step "Downloading Lokio binary..."
        $webClient = New-Object System.Net.WebClient
        $binaryPath = Join-Path $INSTALL_DIR "lokio.exe"
        $webClient.DownloadFile($BINARY_URL, $binaryPath)

        # Add to PATH
        Write-Step "Updating system PATH..."
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
        if ($currentPath -notlike "*$INSTALL_DIR*") {
            $newPath = "$currentPath;$INSTALL_DIR"
            [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
            $env:Path = $newPath
        }

        # Create shortcut in Start Menu (optional)
        $startMenuPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Lokio"
        New-Item -ItemType Directory -Path $startMenuPath -Force | Out-Null
        $shortcutPath = Join-Path $startMenuPath "Lokio.lnk"
        $shell = New-Object -ComObject WScript.Shell
        $shortcut = $shell.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = $binaryPath
        $shortcut.Save()

        return $true
    }
    catch {
        Write-Error "Installation failed: $_"
        return $false
    }
}

# Main installation process
Clear-Host
Write-ColorText "🚀 Lokio Installer for Windows" -Color Cyan
Write-Host

# Check for admin privileges
if (-not (Test-AdminPrivileges)) {
    Write-Error "This script requires administrator privileges. Please run PowerShell as Administrator."
    exit 1
}

Write-Host "Installation will use this location:"
Write-Host "- Program files: $INSTALL_DIR"
Write-Host

if (Install-LokioBinary) {
    Write-Success "Lokio has been successfully installed!"
    Write-Host
    Write-Host "You can now use 'lokio' from any PowerShell or Command Prompt window."
    Write-Host "Note: You may need to restart your terminal for PATH changes to take effect."
}
else {
    Write-Error "Installation failed. Please check the error messages above and try again."
    exit 1
}