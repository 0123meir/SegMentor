#!/usr/bin/env bash

docker build -t gateway-image .
docker run --name gateway -d -p 4000:4000 --env-file=.env gateway-image