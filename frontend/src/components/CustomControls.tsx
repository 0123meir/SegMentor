import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import { BsFullscreen } from "react-icons/bs";
import { Slider } from "@mui/material";
import { FC } from "react";

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
    <div className="absolute bottom-0 left-0 w-full p-2 flex items-center justify-between z-10 text-white">
      <div className="flex items-center gap-4">
        <button onClick={toggleFullscreen} className="hover:text-blue-500">
          <BsFullscreen />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm">
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
        <FaVolumeUp />
        <button
          onClick={togglePlayPause}
          className="play-pause-btn hover:text-blue-500"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
    </div>
  );
};

export default CustomControls;
