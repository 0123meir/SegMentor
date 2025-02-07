import { Fullscreen, Pause, PlayArrow, VolumeUp } from "@mui/icons-material";
import { Slider } from "@mui/material";
import { FC } from "react";

import "../VideoPlayer.css";

interface CustomControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  togglePlayPause: () => void;
  volume: number;
  handleVolumeChange: (e: Event, newValue: number | number[]) => void;
  toggleFullscreen: () => void;
}

const CustomControls: FC<CustomControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  togglePlayPause,
  volume,
  handleVolumeChange,
  toggleFullscreen,
}) => {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="custom-controls">
      <div className="right-controls">
        <button onClick={toggleFullscreen}>
          <Fullscreen />
        </button>
      </div>

      <div className="left-controls">
        <div className="seekbar-timestamp">
          {formatTime(duration)} / {formatTime(currentTime)}
        </div>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.01}
          aria-labelledby="volume-slider"
          style={{ width: "60px" }}
        />
        <VolumeUp />
        <button onClick={togglePlayPause} className="play-pause-btn">
          {isPlaying ? <Pause /> : <PlayArrow />}
        </button>
      </div>
    </div>
  );
};

export default CustomControls;
