#!/bin/bash

# run_main.sh - Script to display version or run main.js with arguments

# ================================
# Functionality:
# 1. Display the script version when called with --version or --v.
# 2. Otherwise, execute main.js with all provided arguments.
# ================================

# Define your script version here
VERSION="1.0.0"

# Function to display the version
show_version() {
    echo "$VERSION"
}

# Function to display usage information
show_usage() {
    echo "Usage: $0 [--version | --v] [arguments...]"
    echo "  --version, --v    Display the script version."
    echo "  arguments...      Arguments to pass to main.js."
}

# Check if no arguments were provided
if [ $# -eq 0 ]; then
    echo "No arguments provided."
    show_usage
    exit 1
fi

# Check if the first argument is --version or --v
case "$1" in
    --version|--v)
        show_version
        exit 0
        ;;
    -*)
        echo "Unknown option: $1"
        show_usage
        exit 1
        ;;
    *)
        # Proceed to run main.js with all passed arguments
        ;;
esac

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if main.js exists in the script directory
MAIN_JS="$SCRIPT_DIR/main.js"
if [ ! -f "$MAIN_JS" ]; then
    echo "Error: main.js not found in $SCRIPT_DIR"
    exit 1
fi

# Execute main.js with all passed arguments
node "$MAIN_JS" "$@"

# Capture the exit status of the node command
EXIT_STATUS=$?

# Exit with the same status as the node command
exit $EXIT_STATUS
