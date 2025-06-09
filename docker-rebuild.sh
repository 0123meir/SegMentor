#!/bin/bash

# Usage: ./docker-rebuild.sh [service_name]

SERVICE_NAME="$1"

if [ -z "$SERVICE_NAME" ]; then
    echo "No service specified. Rebuilding all containers..."

    # Stop and remove all containers
    docker compose down

    # Build all images
    docker compose build

    # Start all containers
    docker compose up -d
else
    # Stop and remove existing container if running
    if [ "$(docker ps -q -f name=^/${SERVICE_NAME}$)" ]; then
        echo "Stopping running container: $SERVICE_NAME"
        docker compose stop "$SERVICE_NAME"
    fi

    if [ "$(docker ps -aq -f name=^/${SERVICE_NAME}$)" ]; then
        echo "Removing existing container: $SERVICE_NAME"
        docker rm "$SERVICE_NAME"
    fi

    # Build the Docker image
    echo "Building Docker image: $SERVICE_NAME"
    docker compose build "$SERVICE_NAME"

    # Run the container
    echo "Starting new container: $SERVICE_NAME"
    docker compose up "$SERVICE_NAME" -d
fi