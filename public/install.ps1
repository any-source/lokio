# URLs and paths
$FILE_LIST_URL = "https://sh.lokio.dev/data/list.yaml"
$BINARY_URL = "https://sh.lokio.dev/bin/lokio.exe"
$DATA_DEST = "$env:USERPROFILE\.lokio"
$BIN_DEST = "$env:USERPROFILE\bin"

# Modern styling
$bold = "`e[1m"
$normal = "`e[0m"
$blue = "`e[34m"
$green = "`e[32m"
$red = "`e[31m"

# Progress bar function
function Show-Progress {
    param (
        [int]$Progress,
        [int]$Total
    )
    $width = 50
    $percentage = [math]::Round(($Progress / $Total) * 100)
    $completed = [math]::Round(($Progress / $Total) * $width)
    $remaining = $width - $completed

    Write-Host -NoNewline "`r[$blue"
    Write-Host -NoNewline ("█" * $completed)
    Write-Host -NoNewline $normal
    Write-Host -NoNewline ("░" * $remaining)
    Write-Host -NoNewline "] $percentage%"
}

# Spinner animation
function Show-Spinner {
    param (
        [scriptblock]$ScriptBlock,
        [string]$Message
    )
    $spinChars = @('⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏')
    $job = Start-Job -ScriptBlock $ScriptBlock
    while ($job.State -eq 'Running') {
        foreach ($char in $spinChars) {
            Write-Host -NoNewline "`r$blue[$char]$normal $Message"
            Start-Sleep -Milliseconds 100
        }
    }
    Write-Host -NoNewline "`r$(' ' * ($Message.Length + 10))`r"
    Receive-Job -Job $job
    Remove-Job -Job $job
}

# Check for dependencies
function Check-Dependencies {
    if (-not (Get-Command "curl.exe" -ErrorAction SilentlyContinue)) {
        Write-Host "$red✗ Dependency 'curl' is not installed. Please install it and try again.$normal"
        exit 1
    }
}

# Main installation process
Write-Host "$bold🚀 Installing Lokio...$normal`n"

# Create directories
if (-not (Test-Path $DATA_DEST)) {
    New-Item -ItemType Directory -Path $DATA_DEST | Out-Null
}
if (-not (Test-Path $BIN_DEST)) {
    New-Item -ItemType Directory -Path $BIN_DEST | Out-Null
}

# Download Lokio binary
Show-Spinner -Message "Downloading Lokio binary..." -ScriptBlock {
    Invoke-WebRequest -Uri $BINARY_URL -OutFile "$BIN_DEST\lokio.exe"
}

# Download list.yaml
Show-Spinner -Message "Downloading configuration files..." -ScriptBlock {
    Invoke-WebRequest -Uri $FILE_LIST_URL -OutFile "$DATA_DEST\list.yaml"
}

# Parse list.yaml and download files
Write-Host "`n${blue}→${normal} Downloading additional files..."
$listContent = Get-Content -Path "$DATA_DEST\list.yaml" -Raw
$fileUrls = ($listContent | Select-String -Pattern "^- url: (.+)$" -AllMatches).Matches.Groups[1].Value
$totalFiles = $fileUrls.Count
$currentFile = 0

foreach ($url in $fileUrls) {
    $fileName = [System.IO.Path]::GetFileName($url)
    Show-Spinner -Message "Downloading $fileName..." -ScriptBlock {
        Invoke-WebRequest -Uri $url -OutFile "$DATA_DEST\$fileName"
    }
    $currentFile++
    Show-Progress -Progress $currentFile -Total $totalFiles
}
Write-Host "`n"

# Add bin directory to PATH if not already present
$envPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($envPath -notmatch [regex]::Escape($BIN_DEST)) {
    [Environment]::SetEnvironmentVariable("PATH", "$envPath;$BIN_DEST", "User")
    Write-Host "${green}✓ Added $BIN_DEST to your PATH.$normal"
}

# Verify installation
if (Get-Command "lokio.exe" -ErrorAction SilentlyContinue) {
    Write-Host "${green}✓ Lokio installed successfully!$normal"
    Write-Host "Installation type: ${bold}User$normal"
    Write-Host "Note: You may need to restart your terminal or log out and back in for changes to take effect."
    Write-Host "`nRun ${bold}lokio${normal} to get started"
} else {
    Write-Host "${red}✗ Installation failed. Please try again.$normal"
    exit 1
}