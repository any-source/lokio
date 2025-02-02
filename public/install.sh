#!/bin/bash

# URLs and paths
FILE_LIST_URL="https://sh.lokio.dev/data/list.yaml"
BINARY_URL="https://sh.lokio.dev/bin/lokio"
DATA_DEST="$HOME/.local/share/lokio"

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
        sudo mkdir -p "/usr/local/bin"
        (sudo curl -s -o "/usr/local/bin/lokio" "$BINARY_URL" && \
         sudo chmod +x "/usr/local/bin/lokio") &
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

    # Download and parse YAML file list
    echo "\n${blue}→${normal} Downloading configuration files..."
    curl -s -o "$DATA_DEST/list.yaml" "$FILE_LIST_URL"
    
    # Count total files for progress bar
    total_files=$(grep "^- url:" "$DATA_DEST/list.yaml" | wc -l)
    current_file=0

    # Download each file
    while IFS=': ' read -r _ url; do
        filename=$(basename "$url")
        curl -s -o "$DATA_DEST/$filename" "$url"
        ((current_file++))
        progress_bar $current_file $total_files
    done < <(grep "^- url:" "$DATA_DEST/list.yaml")
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
    echo "\n${green}✓ Lokio installed successfully!${normal}"
    echo "Installation type: ${bold}$INSTALL_TYPE${normal}"
    [ "$INSTALL_TYPE" = "user" ] && echo "Note: You may need to restart your terminal or run 'source ~/.bashrc'"
    echo "\nRun ${bold}lokio${normal} to get started"
else
    echo "\n${red}✗ Installation failed. Please try again.${normal}"
    exit 1
fi