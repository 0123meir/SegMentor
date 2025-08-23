#!/bin/bash

# Usage: ./deploy.sh user@remote_host:/path/to/deploy

REMOTE="$1"

if [ -z "$REMOTE" ]; then
    echo "Usage: $0 user@remote_host:/path/to/deploy"
    exit 1
fi

# Optional: Build images locally (uncomment if you want to build locally)
# echo "Building Docker images locally..."
# docker compose build

echo "Syncing project files to remote server..."
rsync -avz --delete --exclude 'data' --exclude 'node_modules' --exclude '.git' ./ "$REMOTE"

echo "Deploying on remote server..."
ssh "${REMOTE%%:*}" << EOF
    cd "${REMOTE#*:}"
     docker compose pull  # Pull latest images if using remote registries
     docker compose build # Build images on the server
     docker compose up -d --remove-orphans
EOF

echo "Deployment complete."