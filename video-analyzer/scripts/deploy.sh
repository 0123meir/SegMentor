#!/usr/bin/env bash

docker run --name video-analyzer-service -d -p 8000:8000 --env-file=.env video-analyzer