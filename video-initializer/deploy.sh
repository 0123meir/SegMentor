#!/usr/bin/env bash

docker build -t video-initializer-image .
docker run --name video-initializer -d -p 3005:3005 --env-file=.env video-initializer-image