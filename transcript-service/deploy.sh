#!/usr/bin/env bash

docker build -t transcript-service-image .
docker run --name transcript-service -d -p 3006:3006 --env-file=.env transcript-service-image