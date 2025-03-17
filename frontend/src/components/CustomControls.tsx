import { FC } from "react";
import { BsFullscreen } from "react-icons/bs";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

interface CustomControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  togglePlayPause: () => void;
  volume: number;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleFullscreen: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const CustomControls: FC<CustomControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  togglePlayPause,
  volume,
  handleVolumeChange,
  toggleFullscreen,
  toggleMute,
  isMuted,
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

      <div className="flex items-center justify-start gap-4 text-left">
        <div className="text-sm">
          {formatTime(duration)} / {formatTime(currentTime)}
        </div>

        <input
          type="range"
          min={0}
          max={1}
          value={volume}
          step={0.01}
          onChange={(e) => handleVolumeChange(e)}
          className="w-full h-1 appearance-none bg-blue-500 rounded-full justify-start text-left cursor-pointer
              [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-blue-500 
              [&::-webkit-slider-runnable-track]:rounded-full
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
              [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:-mt-1.5"
          style={{ width: "60px", direction: "ltr" }}
        />

        <button onClick={toggleMute} className="hover:text-blue-500">
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>

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
