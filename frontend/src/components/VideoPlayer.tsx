import { Slider } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import "../VideoPlayer.css";
import CustomControls from "./CustomControls";

export interface VideoPlayerProps {
  url: string;
}

// TODO:
// 1. mute when clicking on volume
// 2. when on full screen do the same display as not

const VideoPlayer = (props: VideoPlayerProps) => {
  const videoRef = useRef<ReactPlayer>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleSeek = (_e: Event, value: number | number[]) => {
    const seekTime = Array.isArray(value) ? value[0] : value;
    if (videoRef.current) {
      setCurrentTime(seekTime);
      videoRef.current.seekTo(seekTime);
    }
  };

  const handleVolumeChange = (_e: Event, newValue: number | number[]) => {
    if (typeof newValue === "number" && videoRef.current) {
      setVolume(newValue);
    }
  };

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: { key: any; preventDefault: () => void }) => {
      switch (event.key) {
        case " ":
          togglePlayPause();
          event.preventDefault();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Escape":
          setIsFullscreen(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlayPause, toggleFullscreen]);

  return (
    <div className={`video-player ${isFullscreen ? "fullscreen" : ""}`}>
      <ReactPlayer
        className="w-full rounded-md"
        ref={videoRef}
        url={props.url}
        controls={false}
        playing={isPlaying}
        volume={volume}
        onClick={togglePlayPause}
        onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
        onDuration={(duration) => setDuration(duration)}
        width="100%"
        height="auto"
      />

      <Slider
        className="seekbar"
        size="small"
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSeek}
      />

      <CustomControls
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        toggleFullscreen={toggleFullscreen}
      />
    </div>
  );
};

export default VideoPlayer;
