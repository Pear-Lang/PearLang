#!/bin/bash

# add_to_path.sh - Enhanced Script to Check and Install Node.js

# ================================
# Functionality:
# 1. Check if Node.js is installed.
# 2. If not, prompt the user to install Node.js.
# 3. Handle user response (Yes/No).
# 4. Install Node.js if user agrees.
# 5. Restart the terminal or source the profile after installation.
# 6. Proceed with existing PATH modifications.
# ================================

# Function to display messages in color
function echo_info() {
    echo -e "\e[34m$1\e[0m"  # Blue color
}

function echo_success() {
    echo -e "\e[32m$1\e[0m"  # Green color
}

function echo_warning() {
    echo -e "\e[33m$1\e[0m"  # Yellow color
}

function echo_error() {
    echo -e "\e[31m$1\e[0m"  # Red color
}

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ===============================
# Step 1: Check if Node.js is installed
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v)
    echo_success "Node.js is already installed. Version: $NODE_VERSION"
else
    echo_warning "Node.js is not installed on your system."

    # ===============================
    # Step 2: Prompt the user to install Node.js
    read -p "Do you want to install Node.js now? (y/n): " choice
    case "$choice" in
        y|Y )
            echo_info "Preparing to install Node.js..."
            ;;
        * )
            echo_error "Node.js is required for this script to run. Exiting..."
            exit 1
            ;;
    esac

    # ===============================
    # Step 3: Install Node.js
    # Detect the operating system and choose the appropriate installation method
    OS_TYPE="$(uname)"
    INSTALL_SUCCESS=false

    if [[ "$OS_TYPE" == "Linux" ]]; then
        # Detect package manager
        if command -v apt-get >/dev/null 2>&1; then
            PACKAGE_MANAGER="apt-get"
            sudo apt-get update
            sudo apt-get install -y nodejs npm
            INSTALL_SUCCESS=true
        elif command -v yum >/dev/null 2>&1; then
            PACKAGE_MANAGER="yum"
            sudo yum install -y nodejs npm
            INSTALL_SUCCESS=true
        elif command -v pacman >/dev/null 2>&1; then
            PACKAGE_MANAGER="pacman"
            sudo pacman -Sy nodejs npm --noconfirm
            INSTALL_SUCCESS=true
        else
            echo_error "Unsupported Linux distribution or package manager. Please install Node.js manually."
            exit 1
        fi
    elif [[ "$OS_TYPE" == "Darwin" ]]; then
        # macOS installation using Homebrew
        if command -v brew >/dev/null 2>&1; then
            PACKAGE_MANAGER="brew"
            brew update
            brew install node
            INSTALL_SUCCESS=true
        else
            echo_error "Homebrew is not installed. Please install Homebrew or Node.js manually."
            exit 1
        fi
    else
        echo_error "Unsupported operating system: $OS_TYPE. Please install Node.js manually."
        exit 1
    fi

    # ===============================
    # Step 4: Verify installation
    if $INSTALL_SUCCESS && command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node -v)
        echo_success "Node.js has been installed successfully. Version: $NODE_VERSION"
    else
        echo_error "Node.js installation failed. Please install it manually and rerun this script."
        exit 1
    fi
fi

# ===============================
# Existing Functionality: Add BIN_DIR to PATH

# Construct the path to the bin directory
BIN_DIR="$SCRIPT_DIR/bin"

# Check if BIN_DIR exists and contains pear
if [[ ! -f "$BIN_DIR/pear.sh" ]]; then
    echo_error "pear not found in $BIN_DIR"
    exit 1
fi

# Check if BIN_DIR is already in PATH
if echo "$PATH" | grep -q "$BIN_DIR"; then
    echo_info "$BIN_DIR is already in your PATH."
else
    echo_info "Adding $BIN_DIR to PATH..."

    # Determine which profile file to update
    if [[ -f "$HOME/.bash_profile" ]]; then
        PROFILE_FILE="$HOME/.bash_profile"
    elif [[ -f "$HOME/.bashrc" ]]; then
        PROFILE_FILE="$HOME/.bashrc"
    elif [[ -f "$HOME/.zshrc" ]]; then
        PROFILE_FILE="$HOME/.zshrc"
    else
        # Default to .profile if none of the above exist
        PROFILE_FILE="$HOME/.profile"
    fi

    # Add BIN_DIR to the profile file if not already present
    if ! grep -q "export PATH=.*$BIN_DIR" "$PROFILE_FILE"; then
        echo "" >> "$PROFILE_FILE"
        echo "# Added by add_to_path.sh script" >> "$PROFILE_FILE"
        echo "export PATH=\"\$PATH:$BIN_DIR\"" >> "$PROFILE_FILE"
        echo_success "$BIN_DIR has been added to your PATH environment variable in $PROFILE_FILE."
        echo "Please run 'source $PROFILE_FILE' or restart your terminal for the changes to take effect."
    else
        echo_info "$BIN_DIR is already present in $PROFILE_FILE."
    fi
fi

# ===============================
# End of Script
exit 0
