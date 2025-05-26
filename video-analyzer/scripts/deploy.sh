#!/usr/bin/env bash

docker run --name video-analyzer-service -d -p 3000:3000 --env-file=.env video-analyzer