# Check for argument
if [ "$#" -ne 1 ] || ([ "$1" != "production" ] && [ "$1" != "dev" ]); then
    echo "Usage: $0 [production|dev]"
    echo "Example: $0 dev"
    exit 1
fi

# Set the command based on the deployment type
if [ "$1" = "production" ]; then
    build_command="pnpm run deploy"
else
    build_command="pnpm run dev"
fi

# Wait for sst's outputs.json to be populated with the API_URL, and store it when it is available
api_url=""
while [ -z "$api_url" ]; do
    if [ -f ../../.sst/outputs.json ] && [ -s ../../.sst/outputs.json ]; then
        api_url=$(cat ../../.sst/outputs.json | grep -o '"api":"[^"]*"' | cut -d'"' -f4)
        if [ ! -z "$api_url" ]; then
            break
        fi
    fi
    sleep 1
done

# inject the API_URL as an environment variable and execute the build command
VITE_API_URL=$api_url $build_command