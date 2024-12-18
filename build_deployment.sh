#!/bin/bash

# Check for argument
if [ "$#" -ne 1 ] || ([ "$1" != "production" ] && [ "$1" != "dev" ]); then
    echo "Usage: $0 [production|dev]"
    echo "Example: $0 dev"
    exit 1
fi

# Set the SST command based on the argument
if [ "$1" = "production" ]; then
    sst_command="pnpx sst deploy --stage production"
    svelte_command="pnpm run deploy"
else
    sst_command="pnpx sst dev"
    svelte_command="pnpm run dev"
fi



# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "tmux is not installed. Please install it first:"
    echo "  macOS:    brew install tmux"
    echo "  Ubuntu:   sudo apt install tmux"
    echo "  Fedora:   sudo dnf install tmux"
    exit 1
fi

echo "Starting SST deployment shell..."
echo "To observe the output for the backend live, run 'pnpx sst dev --print-logs' instead."

# Clear sst's outputs.json file from previous runs
echo "" > ./.sst/outputs.json

# Start a new unnamed tmux session and start the backend dev server
tmux new-session -d $sst_command
echo "Waiting for the SST deployment shell to finish starting..."

# Create a split for the frontend dev server
tmux split-window -h

# Wait for outputs.json to be populated with API URL
api_url=""
while [ -z "$api_url" ]; do
    if [ -f ./.sst/outputs.json ] && [ -s ./.sst/outputs.json ]; then
        api_url=$(cat ./.sst/outputs.json | grep -o '"api":"[^"]*"' | cut -d'"' -f4)
        if [ ! -z "$api_url" ]; then
            break
        fi
    fi
    sleep 1
done

# Start the frontend
tmux send-keys 'cd packages/svelte-app' Enter
tmux send-keys "VITE_API_URL=$api_url $svelte_command" Enter

# Attach to the session
tmux attach-session
