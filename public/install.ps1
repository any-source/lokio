# URL binary
$binaryUrl = "https://sh.lokio.dev/bin/lokio.exe"

# Lokasi instalasi
$installDir = "$env:ProgramFiles\Lokio"

# Buat direktori instalasi jika belum ada
if (-Not (Test-Path $installDir)) {
    Write-Host "Membuat direktori instalasi..."
    New-Item -ItemType Directory -Path $installDir
}

# Unduh binary dengan progress bar
Write-Host "Installing..."
$ProgressPreference = 'SilentlyContinue'  # Nonaktifkan progress bawaan Invoke-WebRequest
Invoke-WebRequest -Uri $binaryUrl -OutFile "$installDir\lokio.exe" -UseBasicParsing

# Berikan izin eksekusi (tidak diperlukan di Windows, karena .exe sudah executable)
Write-Host "Give permission to execute..."
# Tidak ada tindakan khusus yang diperlukan di Windows untuk .exe

# Tambahkan direktori instalasi ke PATH
Write-Host "Add to PATH..."
$env:Path += ";$installDir"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::Machine)

# Verifikasi instalasi
if (Get-Command lokio -ErrorAction SilentlyContinue) {
    Write-Host "`nCongratulations! Let's run 'lokio'."
} else {
    Write-Host "`nInstallation failed. Please try again."
}