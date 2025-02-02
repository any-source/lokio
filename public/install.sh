#!/bin/bash

# Warna untuk output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Deteksi platform dan arsitektur
OS=$(uname -s)
ARCH=$(uname -m)

# Tentukan path binary berdasarkan platform
BINARY_PATH=""
if [ "$OS" = "Linux" ] && [ "$ARCH" = "x86_64" ]; then
    BINARY_PATH="install/linux"
elif [ "$OS" = "Darwin" ] && [ "$ARCH" = "arm64" ]; then
    BINARY_PATH="install/macos-chip"
elif [ "$OS" = "Darwin" ] && [ "$ARCH" = "x86_64" ]; then
    BINARY_PATH="install/macos-intel"
else
    echo -e "${RED}Platform tidak didukung: $OS-$ARCH${NC}"
    exit 1
fi

# Fungsi untuk mencoba instalasi sistem
try_system_install() {
    if sudo -n true 2>/dev/null; then
        # Sudo tersedia tanpa password
        sudo mkdir -p "/usr/local/bin"
        echo "Menginstall ke direktori sistem..."
        sudo cp "$1" "/usr/local/bin/lokio"
        sudo chmod +x "/usr/local/bin/lokio"
        return 0
    fi
    return 1
}

# Fungsi untuk instalasi user
do_user_install() {
    echo "Menginstall ke direktori pengguna..."
    mkdir -p "$HOME/.local/bin"
    cp "$1" "$HOME/.local/bin/lokio"
    chmod +x "$HOME/.local/bin/lokio"
    
    # Tambahkan ke PATH jika belum ada
    if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
        export PATH="$HOME/.local/bin:$PATH"
    fi
}

# Main installation
echo "Menginstall Lokio untuk $OS-$ARCH..."

# Periksa apakah file binary ada
if [ ! -f "$BINARY_PATH" ]; then
    echo -e "${RED}File binary tidak ditemukan di: $BINARY_PATH${NC}"
    exit 1
fi

# Coba instalasi sistem dulu
if try_system_install "$BINARY_PATH"; then
    INSTALL_TYPE="system"
else
    # Jika gagal, lakukan instalasi user
    do_user_install "$BINARY_PATH"
    INSTALL_TYPE="user"
fi

# Verifikasi instalasi
if command -v lokio &> /dev/null; then
    echo -e "\n${GREEN}Selamat! Lokio berhasil diinstall!${NC}"
    echo -e "Tipe instalasi: $INSTALL_TYPE"
    if [ "$INSTALL_TYPE" = "user" ]; then
        echo -e "Catatan: Anda mungkin perlu me-restart terminal atau menjalankan 'source ~/.bashrc'"
    fi
    echo -e "Mari jalankan 'lokio'"
else
    echo -e "\n${RED}Instalasi gagal. Silakan coba lagi.${NC}"
    exit 1
fi