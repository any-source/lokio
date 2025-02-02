#!/bin/bash

BINARY_URL="https://sh.lokio.dev/bin/lokio"
INSTALL_DIR="/usr/local/bin"

# Modern UI helper functions
write_color_text() {
    local text=$1
    local color=$2
    local no_newline=$3

    case $color in
        "red")    color_code="\033[31m" ;;
        "green")  color_code="\033[32m" ;;
        "cyan")   color_code="\033[36m" ;;
        *)        color_code="\033[39m" ;;
    esac

    if [ "$no_newline" = "true" ]; then
        echo -ne "${color_code}${text}\033[0m"
    else
        echo -e "${color_code}${text}\033[0m"
    fi
}

write_step() {
    local message=$1
    write_color_text "→ " "cyan" true
    write_color_text "$message"
}

write_success() {
    local message=$1
    write_color_text "✓ " "green" true
    write_color_text "$message"
}

write_error() {
    local message=$1
    write_color_text "✗ " "red" true
    write_color_text "$message" "red"
}

install_lokio_binary() {
    # Create installation directory
    write_step "Creating installation directory..."
    if ! mkdir -p "$INSTALL_DIR"; then
        write_error "Failed to create installation directory"
        return 1
    fi

    # Download and install binary
    write_step "Downloading Lokio binary..."
    if ! curl -L "$BINARY_URL" -o "$INSTALL_DIR/lokio"; then
        write_error "Failed to download binary"
        return 1
    fi

    if ! chmod +x "$INSTALL_DIR/lokio"; then
        write_error "Failed to make binary executable"
        return 1
    fi

    # Add to PATH (if not already added)
    write_step "Updating system PATH..."
    if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
        echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$HOME/.bashrc"
        source "$HOME/.bashrc"
    fi

    return 0
}

test_admin_privileges() {
    if [[ $EUID -eq 0 ]]; then
        return 0
    else
        return 1
    fi
}

# Main installation process
clear
write_color_text "🚀 Lokio Binary Installer for macOS/Linux" "cyan"
echo

if ! test_admin_privileges; then
    write_error "This script requires administrator privileges. Please run with sudo."
    exit 1
fi

echo "Installation will use this location:"
echo "- Program files: $INSTALL_DIR"
echo

if install_lokio_binary; then
    write_success "Lokio binary has been successfully installed!"
    echo
    echo "You can now use 'lokio' from any terminal window."
    echo "Note: You may need to restart your terminal session for PATH changes to take effect."
else
    write_error "Installation failed. Please check the error messages above and try again."
    exit 1
fi