#!/usr/bin/env bash

docker build -t s3-dal-image .
docker run --name s3-dal -d -p 3004:3004 --env-file=.env s3-dal-image