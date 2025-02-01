#!/bin/bash

# Function to run a command and handle errors
run_command() {
    echo "Running: $1"
    if ! eval "$1"; then
        echo "Error running command: $1"
        exit 1
    fi
}

# Run lint, check, and format
run_command "bun run format"

# Stage changes (excluding specific files, like `.env`, if needed)
run_command "git add ."

# Prompt for commit message
read -r -p "Enter commit message: " msg

# Commit changes
run_command "git commit -m \"$msg\""

# Push changes
# run_command "git push"