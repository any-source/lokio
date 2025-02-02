#!/bin/bash
# URLs and paths
FOLDER_URL="https://sh.lokio.dev/data"
BINARY_URL="https://sh.lokio.dev/bin/lokio"
DATA_DEST="$HOME/.local/share/lokio"

# Modern styling
bold=$(tput bold)
normal=$(tput sgr0)
blue=$(tput setaf 4)
green=$(tput setaf 2)
red=$(tput setaf 1)

# Spinner animation
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf "\r${blue}[%c]${normal} %s" "$spinstr" "$2"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
    done
    printf "\r\033[K"
}

echo "${bold}🚀 Installing Lokio...${normal}\n"

# Check for dependencies
check_dependencies() {
    local dependencies=("curl" "rsync" "grep")
    for dep in "${dependencies[@]}"; do
        if ! command -v "$dep" &>/dev/null; then
            echo "${red}✗ Dependency '$dep' is not installed. Please install it and try again.${normal}"
            exit 1
        fi
    done
}

# Try system installation first
install_system() {
    echo "${blue}→${normal} Attempting system installation..."
    if sudo -n true 2>/dev/null; then
        sudo mkdir -p "/usr/local/bin"
        (sudo curl -s -o "/usr/local/bin/lokio" "$BINARY_URL" &&
            sudo chmod +x "/usr/local/bin/lokio") &
        spinner $! "Downloading Lokio binary..."
        return 0
    fi
    return 1
}

# User installation
install_user() {
    echo "${blue}→${normal} Installing in user directory..."
    mkdir -p "$HOME/.local/bin" "$DATA_DEST"

    # Download binary
    (curl -s -o "$HOME/.local/bin/lokio" "$BINARY_URL" &&
        chmod +x "$HOME/.local/bin/lokio") &
    spinner $! "Downloading Lokio binary..."

    # Create temporary directory for downloading
    TMP_DIR=$(mktemp -d)
    
    echo "\n${blue}→${normal} Configuring files..."
    
    # Download entire data directory using rsync or recursive curl
    if command -v rsync &>/dev/null; then
        rsync -az --progress "$FOLDER_URL/" "$DATA_DEST/" &
        spinner $! "Syncing data files..."
    else
        # Alternative method using wget or curl with recursive download
        (curl -s -o "$TMP_DIR/data.tar.gz" "$FOLDER_URL/archive.tar.gz" &&
            tar xzf "$TMP_DIR/data.tar.gz" -C "$DATA_DEST") &
        spinner $! "Downloading and extracting data files..."
    fi

    # Cleanup
    rm -rf "$TMP_DIR"

    # Update PATH if needed
    if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >>"$HOME/.bashrc"
        export PATH="$HOME/.local/bin:$PATH"
    fi
}

# Main installation process
check_dependencies
if install_system; then
    INSTALL_TYPE="system"
else
    install_user
    INSTALL_TYPE="user"
fi

# Verify installation
if command -v lokio &>/dev/null; then
    echo "\n${green}✓ Lokio installed successfully!${normal}"
    echo "Installation type: ${bold}$INSTALL_TYPE${normal}"
    [ "$INSTALL_TYPE" = "user" ] && echo "Note: You may need to restart your terminal or run 'source ~/.bashrc'"
    echo "\nRun ${bold}lokio${normal} to get started"
else
    echo "\n${red}✗ Installation failed. Please try again.${normal}"
    exit 1
fi