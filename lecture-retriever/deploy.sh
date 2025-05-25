#!/usr/bin/env bash

docker build -t lecture-retriever-image .
docker run --name lecture-retriever -d -p 3003:3003 --env-file=.env lecture-retriever-image