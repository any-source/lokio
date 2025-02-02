#!/bin/bash

set -e

# Tentukan arsitektur macOS
ARCH=$(uname -m)

if [[ "$ARCH" == "arm64" ]]; then
    FILE_URL="https://lokio.dev/install/macos-chip"
else
    echo "Arsitektur tidak didukung!"
    exit 1
fi

# Tentukan nama file yang diunduh
FILE_NAME="lokio"

# Unduh file
echo "Mengunduh $FILE_NAME dari $FILE_URL..."
curl -fsSL "$FILE_URL" -o "$FILE_NAME"

# Beri izin eksekusi
chmod +x "$FILE_NAME"

# Pindahkan ke /usr/local/bin agar bisa diakses dari terminal
sudo mv "$FILE_NAME" /usr/local/bin/lokio

echo "Instalasi selesai! Anda bisa menjalankan 'lokio' dari terminal."
