#!/usr/bin/env bash

docker build -t permission-service-image .
docker run --name permission-service -d -p 3001:3001 --env-file=.env permission-service-image