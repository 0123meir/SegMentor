import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import CustomControls from "./CustomControls";

export interface VideoPlayerProps {
  url: string;
}

const VideoPlayer = (props: VideoPlayerProps) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<ReactPlayer>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(event.target.value);
    if (videoRef.current) {
      setCurrentTime(seekTime);
      videoRef.current.seekTo(seekTime);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (videoRef.current) {
      setVolume(newValue);
      setIsMuted(false);
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
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
          if (document.fullscreenElement) document.exitFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlayPause, toggleFullscreen]);

  return (
    <div ref={videoContainerRef} className="relative w-full bg-black">
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

      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        className="absolute bottom-10 left-0 w-full h-5 bg-blue-500 rounded-full appearance-none cursor-pointer transition-all bg-transparent
             [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-blue-500
             [&::-webkit-slider-runnable-track]:rounded-full 
             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:-mt-1
             [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white 
             [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md 
             [&::-webkit-slider-thumb]:hover:bg-gray-200"
        style={{ direction: "ltr" }}
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
