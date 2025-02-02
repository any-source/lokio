#!/bin/bash

# Load config
if ! command -v jq &>/dev/null; then
    echo "jq is required. Please install it first:"
    echo "Ubuntu/Debian: sudo apt-get install jq"
    echo "Fedora: sudo dnf install jq"
    echo "macOS: brew install jq"
    exit 1
fi

# Read config file
CONFIG_FILE="config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: config.json not found"
    exit 1
fi

# Parse config
BINARY_URL=$(jq -r '.binary.linux' "$CONFIG_FILE")
DATA_DEST=$(jq -r '.paths.linux.dataDir' "$CONFIG_FILE" | envsubst)
INSTALL_DIR=$(jq -r '.paths.linux.installDir' "$CONFIG_FILE" | envsubst)

# Get config files array
mapfile -t CONFIG_FILES < <(jq -r '.configFiles[]' "$CONFIG_FILE")

# Modern styling
bold=$(tput bold)
normal=$(tput sgr0)
blue=$(tput setaf 4)
green=$(tput setaf 2)
red=$(tput setaf 1)

# Progress bar function
progress_bar() {
    local progress=$1
    local total=$2
    local width=50
    local percentage=$((progress * 100 / total))
    local completed=$((width * progress / total))
    local remaining=$((width - completed))
    
    printf "\r[${blue}"
    printf "%${completed}s" | tr ' ' '█'
    printf "${normal}"
    printf "%${remaining}s" | tr ' ' '░'
    printf "] ${percentage}%%"
}

# Spinner animation
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf "\r${blue}[%c]${normal} " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
    done
    printf "\r   \r"
}

echo "${bold}🚀 Installing Lokio...${normal}\n"

# Try system installation first
install_system() {
    echo "${blue}→${normal} Attempting system installation..."
    if sudo -n true 2>/dev/null; then
        sudo mkdir -p "$INSTALL_DIR"
        (sudo curl -s -o "$INSTALL_DIR/lokio" "$BINARY_URL" && \
         sudo chmod +x "$INSTALL_DIR/lokio") &
        spinner $!
        return 0
    fi
    return 1
}

# User installation
install_user() {
    echo "${blue}→${normal} Installing in user directory..."
    mkdir -p "$HOME/.local/bin" "$DATA_DEST"
    
    # Download binary
    (curl -s -o "$HOME/.local/bin/lokio" "$BINARY_URL" && \
     chmod +x "$HOME/.local/bin/lokio") &
    spinner $!

    # Download configuration files
    echo -e "\n${blue}→${normal} Downloading configuration files..."
    total_files=${#CONFIG_FILES[@]}
    current_file=0

    # Download each file
    for url in "${CONFIG_FILES[@]}"; do
        filename=$(basename "$url")
        curl -s -o "$DATA_DEST/$filename" "$url"
        ((current_file++))
        progress_bar $current_file $total_files
    done
    echo # New line after progress bar

    # Update PATH if needed
    if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
        export PATH="$HOME/.local/bin:$PATH"
    fi
}

# Main installation process
if install_system; then
    INSTALL_TYPE="system"
else
    install_user
    INSTALL_TYPE="user"
fi

# Verify installation
if command -v lokio &>/dev/null; then
    echo -e "\n${green}✓ Lokio installed successfully!${normal}"
    echo "Installation type: ${bold}$INSTALL_TYPE${normal}"
    [ "$INSTALL_TYPE" = "user" ] && echo "Note: You may need to restart your terminal or run 'source ~/.bashrc'"
    echo -e "\nRun ${bold}lokio${normal} to get started"
else
    echo -e "\n${red}✗ Installation failed. Please try again.${normal}"
    exit 1
fi