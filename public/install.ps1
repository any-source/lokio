# Base URL untuk binary
$BASE_URL = "http://103.127.96.116:9000/install"

# URL binary untuk Windows
$BINARY_URLS = @{
    "Windows-AMD64" = "$BASE_URL/windows.exe"
}

# Fungsi untuk logging dengan warna
function Write-ColorOutput {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,
        
        [Parameter(Mandatory = $false)]
        [string]$Color = "White"
    )
    
    $prevColor = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $Color
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $prevColor
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "[INFO] $Message" "Green"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "[ERROR] $Message" "Red"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "[WARNING] $Message" "Yellow"
}

# Fungsi untuk cek koneksi ke server
function Test-ServerConnection {
    try {
        $response = Invoke-WebRequest -Uri $BASE_URL -Method Head -UseBasicParsing
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

# Fungsi untuk mendapatkan arsitektur sistem
function Get-SystemArchitecture {
    if ([Environment]::Is64BitOperatingSystem) {
        return "AMD64"
    }
    else {
        return "x86"
    }
}

# Fungsi untuk menambahkan ke PATH
function Add-ToPath {
    param(
        [string]$Directory
    )
    
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($currentPath -notlike "*$Directory*") {
        $newPath = "$currentPath;$Directory"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        $env:Path = "$env:Path;$Directory"
        Write-Info "Added $Directory to PATH"
    }
}

# Fungsi utama instalasi
function Install-Lokio {
    # Deteksi platform
    $os = "Windows"
    $arch = Get-SystemArchitecture
    $platformKey = "$os-$arch"
    
    Write-Info "Detected platform: $platformKey"
    
    # Verifikasi platform didukung
    if (-not $BINARY_URLS.ContainsKey($platformKey)) {
        Write-Error "Unsupported platform: $platformKey"
        return $false
    }
    
    # Cek koneksi ke server
    if (-not (Test-ServerConnection)) {
        Write-Error "Cannot connect to download server. Please check your internet connection."
        return $false
    }
    
    # Buat direktori instalasi
    $installDir = "$env:LOCALAPPDATA\Lokio"
    $binaryPath = "$installDir\lokio.exe"
    
    try {
        # Buat direktori jika belum ada
        if (-not (Test-Path $installDir)) {
            New-Item -ItemType Directory -Path $installDir -Force | Out-Null
            Write-Info "Created installation directory: $installDir"
        }
        
        # Download binary
        Write-Info "Downloading Lokio..."
        $binaryUrl = $BINARY_URLS[$platformKey]
        Invoke-WebRequest -Uri $binaryUrl -OutFile $binaryPath -UseBasicParsing
        
        # Verifikasi file terdownload
        if (-not (Test-Path $binaryPath)) {
            Write-Error "Failed to download binary"
            return $false
        }
        
        # Tambahkan ke PATH
        Add-ToPath $installDir
        
        # Verifikasi instalasi
        try {
            $null = Get-Command "lokio.exe" -ErrorAction Stop
            Write-Info "Lokio has been successfully installed!"
            Write-Info "You can now use 'lokio' from any terminal"
            Write-Info "Note: You may need to restart your terminal to use the 'lokio' command"
            return $true
        }
        catch {
            Write-Error "Installation verification failed. 'lokio' command not found in PATH"
            return $false
        }
    }
    catch {
        Write-Error "Installation failed: $_"
        return $false
    }
}

# Main execution
try {
    # Cek jika PowerShell dijalankan sebagai administrator
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if (-not $isAdmin) {
        Write-Warning "Running without administrator privileges. Installation will be done for current user only."
    }
    
    if (-not (Install-Lokio)) {
        exit 1
    }
}
catch {
    Write-Error "Unexpected error occurred: $_"
    exit 1
}