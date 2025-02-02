#!/bin/bash

# Exit on error
set -e

# Base URL untuk binary
BASE_URL="http://103.127.96.116:9000/install"

# URL binary untuk berbagai platform
declare -A BINARY_URLS
BINARY_URLS["Linux-x86_64"]="${BASE_URL}/linux"
BINARY_URLS["Darwin-arm64"]="${BASE_URL}/macos-chip"
BINARY_URLS["Darwin-x86_64"]="${BASE_URL}/macos-intel"

# Nama binary untuk setiap platform
declare -A BINARY_NAMES
BINARY_NAMES["Linux-x86_64"]="linux"
BINARY_NAMES["Darwin-arm64"]="macos-chip"
BINARY_NAMES["Darwin-x86_64"]="macos-intel"

# Warna untuk output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fungsi untuk logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Fungsi untuk verifikasi koneksi ke server
check_server_connection() {
    if ! curl --silent --head --fail "$BASE_URL" >/dev/null; then
        log_error "Cannot connect to download server. Please check your internet connection."
        return 1
    fi
}

# Fungsi untuk mencoba instalasi sistem
try_system_install() {
    local binary_url="$1"
    local temp_file
    temp_file=$(mktemp)
    
    log_info "Attempting system-wide installation..."
    
    if ! sudo -n true 2>/dev/null; then
        log_warning "No sudo access or requires password. Falling back to user installation."
        return 1
    fi
    
    # Download ke temporary file terlebih dahulu
    if ! curl -# -L -o "$temp_file" "$binary_url"; then
        log_error "Failed to download binary"
        rm -f "$temp_file"
        return 1
    fi
    
    # Buat direktori jika belum ada
    if ! sudo mkdir -p "/usr/local/bin"; then
        log_error "Failed to create /usr/local/bin directory"
        rm -f "$temp_file"
        return 1
    fi
    
    # Pindahkan file dan set permission
    if ! sudo mv "$temp_file" "/usr/local/bin/lokio"; then
        log_error "Failed to move binary to /usr/local/bin"
        rm -f "$temp_file"
        return 1
    fi
    
    if ! sudo chmod +x "/usr/local/bin/lokio"; then
        log_error "Failed to set executable permissions"
        return 1
    fi
    
    return 0
}

# Fungsi untuk instalasi user
do_user_install() {
    local binary_url="$1"
    local temp_file
    temp_file=$(mktemp)
    
    log_info "Performing user installation..."
    
    # Buat direktori user bin jika belum ada
    if ! mkdir -p "$HOME/.local/bin"; then
        log_error "Failed to create user bin directory"
        return 1
    fi
    
    # Download ke temporary file
    if ! curl -# -L -o "$temp_file" "$binary_url"; then
        log_error "Failed to download binary"
        rm -f "$temp_file"
        return 1
    fi
    
    # Pindahkan file dan set permission
    if ! mv "$temp_file" "$HOME/.local/bin/lokio"; then
        log_error "Failed to move binary to user bin directory"
        rm -f "$temp_file"
        return 1
    fi
    
    if ! chmod +x "$HOME/.local/bin/lokio"; then
        log_error "Failed to set executable permissions"
        return 1
    }
    
    # Update PATH jika perlu
    if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
        local shell_rc
        if [ -f "$HOME/.zshrc" ]; then
            shell_rc="$HOME/.zshrc"
        else
            shell_rc="$HOME/.bashrc"
        fi
        
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$shell_rc"
        export PATH="$HOME/.local/bin:$PATH"
        log_info "Added $HOME/.local/bin to PATH in $shell_rc"
    fi
    
    return 0
}

# Main script
main() {
    # Deteksi platform
    local os arch platform_key
    os=$(uname -s)
    arch=$(uname -m)
    platform_key="$os-$arch"
    
    log_info "Detected platform: $platform_key"
    
    # Verifikasi platform didukung
    if [ -z "${BINARY_URLS[$platform_key]}" ]; then
        log_error "Unsupported platform: $platform_key"
        exit 1
    fi
    
    # Cek koneksi ke server
    if ! check_server_connection; then
        exit 1
    fi
    
    local binary_url="${BINARY_URLS[$platform_key]}"
    local install_type
    
    # Coba system install dulu, jika gagal lakukan user install
    if try_system_install "$binary_url"; then
        install_type="system"
    else
        if ! do_user_install "$binary_url"; then
            log_error "Installation failed"
            exit 1
        fi
        install_type="user"
    fi
    
    # Verifikasi instalasi
    if ! command -v lokio &>/dev/null; then
        log_error "Installation verification failed. 'lokio' command not found in PATH"
        exit 1
    fi
    
    # Success message
    log_info "Lokio has been successfully installed! ($install_type installation)"
    if [ "$install_type" = "user" ]; then
        log_info "Please restart your terminal or run: source ~/.bashrc (or ~/.zshrc)"
    fi
    log_info "You can now use 'lokio' command"
}

# Run main dengan error handling
if ! main; then
    log_error "Installation failed"
    exit 1
fi