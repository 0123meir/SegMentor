import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import CustomControls from "./CustomControls";
import SegmentsTimeline from "./SegmentsTimeLine";

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
    if (volume === 0 && !isMuted) {
      setIsMuted(true);
    } else if (volume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [volume]);

  useEffect(() => {
    const TIME_AND_VOLUME_SEEKBAR = "INPUT";
    const SPACE_KEY = " ";
    const FULLSCREEN_KEY = "f";
    const EXIT_FULLSCREEN_KEY = "Escape";
    const MUTE_KEY = "m";
    const SEEK_FORWARD_KEY = "ArrowRight";
    const SEEK_BACKWARD_KEY = "ArrowLeft";
    const VOLUME_UP_KEY = "ArrowUp";
    const VOLUME_DOWN_KEY = "ArrowDown";

    const handleKeyDown = (event: { key: any; preventDefault: () => void }) => {
      if (
        document.activeElement?.tagName === TIME_AND_VOLUME_SEEKBAR &&
        [
          SEEK_FORWARD_KEY,
          SEEK_BACKWARD_KEY,
          VOLUME_UP_KEY,
          VOLUME_DOWN_KEY,
        ].includes(event.key)
      ) {
        event.preventDefault();
      }

      switch (event.key) {
        case SPACE_KEY:
          togglePlayPause();
          event.preventDefault();
          break;
        case FULLSCREEN_KEY:
          toggleFullscreen();
          break;
        case EXIT_FULLSCREEN_KEY:
          if (document.fullscreenElement) document.exitFullscreen();
          break;
        case MUTE_KEY:
          toggleMute();
          break;
        case SEEK_FORWARD_KEY:
          if (videoRef.current) {
            const newTime = Math.min(
              videoRef.current.getCurrentTime() + 10,
              videoRef.current.getDuration()
            );
            setCurrentTime(newTime);
            videoRef.current.seekTo(newTime);
          }
          break;
        case SEEK_BACKWARD_KEY:
          if (videoRef.current) {
            const newTime = Math.max(videoRef.current.getCurrentTime() - 10, 0);
            setCurrentTime(newTime);
            videoRef.current.seekTo(newTime);
          }
          break;
        case VOLUME_UP_KEY:
          setVolume((prevVolume) => {
            const newVolume = Math.min(prevVolume + 0.1, 1);
            return newVolume;
          });
          break;
        case VOLUME_DOWN_KEY:
          setVolume((prevVolume) => {
            const newVolume = Math.max(prevVolume - 0.1, 0);
            return newVolume;
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlayPause, toggleFullscreen, toggleMute]);

  return (
    <div
      ref={videoContainerRef}
      className="relative w-full bg-black rounded-lg"
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

      <SegmentsTimeline
        duration={duration}
        currentTime={currentTime}
        handleSeek={handleSeek}
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
