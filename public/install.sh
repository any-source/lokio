#!/bin/bash

BINARY_URL="https://sh.lokio.dev/bin/lokio"
CONFIG_URLS=(
    "https://sh.lokio.dev/data/info.md"
    "https://sh.lokio.dev/data/config/astro-frontend.yaml"
    "https://sh.lokio.dev/data/config/go-backend.yaml"
    "https://sh.lokio.dev/data/config/hono-backend.yaml"
    "https://sh.lokio.dev/data/config/kt-mobile-compose-mvvm.yaml"
    "https://sh.lokio.dev/data/config/next-frontend.yaml"
    "https://sh.lokio.dev/data/config/next-monolith.yaml"
    "https://sh.lokio.dev/data/ejs.t/golang/controller.ejs.t"
    "https://sh.lokio.dev/data/ejs.t/kotlin/screen.ejs.t"
)
INSTALL_DIR="/usr/local/bin"
DATA_DIR="$HOME/.lokio"

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

show_progress() {
    local current=$1
    local total=$2
    local activity=$3

    local percentage=$((current * 100 / total))
    local width=50
    local completed=$((width * current / total))
    local remaining=$((width - completed))

    printf "\r%s [%-${width}s] %d%%" "$activity" "$(printf "%${completed}s" | tr ' ' '█')$(printf "%${remaining}s" | tr ' ' '░')" "$percentage"
}

install_lokio_files() {
    try {
        # Create installation directories
        write_step "Creating installation directories..."
        mkdir -p "$INSTALL_DIR"
        mkdir -p "$DATA_DIR"

        # Download and install binary
        write_step "Downloading Lokio binary..."
        curl -L "$BINARY_URL" -o "$INSTALL_DIR/lokio"
        chmod +x "$INSTALL_DIR/lokio"  # Make the binary executable

        # Download configuration files
        write_step "Downloading configuration files..."
        total_files=${#CONFIG_URLS[@]}
        current_file=0

        for url in "${CONFIG_URLS[@]}"; do
            filename=$(basename "$url")
            out_path="$DATA_DIR/$filename"

            curl -L "$url" -o "$out_path"
            current_file=$((current_file + 1))
            show_progress "$current_file" "$total_files" "Downloading files"
        done
        echo

        # Add to PATH (if not already added)
        write_step "Updating system PATH..."
        if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
            echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$HOME/.bashrc"
            source "$HOME/.bashrc"
        fi

        return 0
    } catch {
        write_error "Installation failed: $1"
        return 1
    }
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
write_color_text "🚀 Lokio Installer for macOS/Linux" "cyan"
echo

if ! test_admin_privileges; then
    write_error "This script requires administrator privileges. Please run with sudo."
    exit 1
fi

echo "Installation will use these locations:"
echo "- Program files: $INSTALL_DIR"
echo "- Data files: $DATA_DIR"
echo

if install_lokio_files; then
    write_success "Lokio has been successfully installed!"
    echo
    echo "You can now use 'lokio' from any terminal window."
    echo "Note: You may need to restart your terminal session for PATH changes to take effect."
else
    write_error "Installation failed. Please check the error messages above and try again."
    exit 1
fi