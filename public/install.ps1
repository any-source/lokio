# Read and parse config
$configJson = Get-Content -Path "config.json" -Raw | ConvertFrom-Json

# Set configuration
$CONFIG = @{
    BinaryUrl = $configJson.binary.windows
    ConfigUrls = $configJson.configFiles
    InstallDir = $ExecutionContext.InvokeCommand.ExpandString($configJson.paths.windows.installDir)
    DataDir = $ExecutionContext.InvokeCommand.ExpandString($configJson.paths.windows.dataDir)
}

# Modern UI helper functions
function Write-ColorText {
    param (
        [string]$Text,
        [string]$Color = "White",
        [switch]$NoNewline
    )
    $params = @{
        ForegroundColor = $Color
        NoNewline = $NoNewline.IsPresent
    }
    Write-Host $Text @params
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

function Show-Progress {
    param (
        [int]$Current,
        [int]$Total,
        [string]$Activity
    )
    $percentage = [math]::Round(($Current / $Total) * 100)
    $width = 50
    $completed = [math]::Round(($width * $Current) / $Total)
    $remaining = $width - $completed
    
    $progressBar = "[" + 
        ("█" * $completed) +
        ("░" * $remaining) +
        "] ${percentage}%"
    
    Write-Host "`r$Activity $progressBar" -NoNewline
}

function Install-LokioFiles {
    try {
        # Create installation directories
        Write-Step "Creating installation directories..."
        New-Item -ItemType Directory -Force -Path $CONFIG.InstallDir | Out-Null
        New-Item -ItemType Directory -Force -Path $CONFIG.DataDir | Out-Null

        # Download and install binary
        Write-Step "Downloading Lokio binary..."
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $CONFIG.BinaryUrl -OutFile "$($CONFIG.InstallDir)\lokio.exe" -UseBasicParsing

        # Download configuration files
        Write-Step "Downloading configuration files..."
        $totalFiles = $CONFIG.ConfigUrls.Count
        $currentFile = 0

        foreach ($url in $CONFIG.ConfigUrls) {
            $fileName = Split-Path $url -Leaf
            $outPath = Join-Path $CONFIG.DataDir $fileName
            
            Invoke-WebRequest -Uri $url -OutFile $outPath -UseBasicParsing
            $currentFile++
            Show-Progress -Current $currentFile -Total $totalFiles -Activity "Downloading files"
        }
        Write-Host "`n"

        # Add to PATH
        Write-Step "Updating system PATH..."
        $currentPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)
        if ($currentPath -notlike "*$($CONFIG.InstallDir)*") {
            $newPath = "$currentPath;$($CONFIG.InstallDir)"
            [Environment]::SetEnvironmentVariable(
                "Path", 
                $newPath, 
                [EnvironmentVariableTarget]::Machine
            )
            $env:Path = $newPath
        }

        return $true
    }
    catch {
        Write-Error "Installation failed: $_"
        return $false
    }
}

function Test-AdminPrivileges {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Main installation process
Clear-Host
Write-ColorText "🚀 Lokio Installer for Windows" -Color Cyan
Write-Host "`n"

if (-not (Test-AdminPrivileges)) {
    Write-Error "This script requires administrator privileges. Please run PowerShell as Administrator."
    exit 1
}

Write-Host "Installation will use these locations:"
Write-Host "- Program files: $($CONFIG.InstallDir)"
Write-Host "- Data files: $($CONFIG.DataDir)"
Write-Host "`n"

$install = Install-LokioFiles
if ($install) {
    Write-Success "Lokio has been successfully installed!"
    Write-Host "`nYou can now use 'lokio' from any new PowerShell window"
    Write-Host "Note: You may need to restart your PowerShell session for PATH changes to take effect"
}
else {
    Write-Error "Installation failed. Please check the error messages above and try again."
    exit 1
}