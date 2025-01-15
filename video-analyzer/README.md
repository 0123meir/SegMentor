# Video Analyzer Service

## Overview

The Video Analyzer Service is designed to process MP3 files from a cache, convert them to SRT files, and then segment the subtitles by subjects.

## Workflow

1. **Queue Management**: The service retrieves an ID from a queue and retrieves a coresponding MP3 file from a cache DB.
2. **MP3 to SRT Conversion**: Each MP3 file is processed and converted into an SRT file, which contains the transcribed text with timestamps.
3. **Segmentation by Subjects**: The SRT file is analyzed and segmented into different subjects based on the content.

## Usage

1. **Start the Service**: Initialize the service to start processing the queue, check if the queue is active and that the cache DB is available.
2. **Monitor the Queue**: Ensure MP3 files are being added to the queue for processing.
3. **Retrieve Results**: Get the results from the the segMentor system DB