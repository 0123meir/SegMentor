import { Slider } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import CustomControls from "./CustomControls";

export interface VideoPlayerProps {
  url: string;
}

const VideoPlayer = (props: VideoPlayerProps) => {
  const videoRef = useRef<ReactPlayer>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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
      setIsMuted(false);
    }
  };

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const toggleMute = () => {
    isMuted ? setVolume(1) : setVolume(0);
    setIsMuted((prev) => !prev);
  };

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
    <div
      className={`relative w-full ${
        isFullscreen
          ? "fixed top-0 left-0 w-screen h-screen z-10 bg-black"
          : "bg-black"
      }`}
    >
      <ReactPlayer
        className="absolute rounded-md"
        ref={videoRef}
        url={props.url}
        controls={false}
        playing={isPlaying}
        volume={volume}
        onClick={togglePlayPause}
        onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
        onDuration={(duration) => setDuration(duration)}
        width="100%"
        height="100%"
      />

      <Slider
        size="small"
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        style={{ position: "absolute", bottom: "40px" }}
      />

      <CustomControls
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        toggleFullscreen={toggleFullscreen}
        toggleMute={toggleMute}
        isMuted={isMuted}
      />
    </div>
  );
};

export default VideoPlayer;
