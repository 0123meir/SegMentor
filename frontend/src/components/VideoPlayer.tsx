import { Segment } from '@/types/Segment';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

import CustomControls from './CustomControls';
import SegmentsTimeline from './timeline/SegmentsTimeLine';
import { SearchBar } from './SearchBar';

export interface VideoPlayerProps {
  url: string;
  segments: Segment[];
}

const VideoPlayer = ({ url, segments }: VideoPlayerProps) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<ReactPlayer>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

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

  const toggleMute = useCallback(() => {
    setVolume(isMuted ? 1 : 0);
    setIsMuted((prev) => !prev);
  }, [isMuted]);

  useEffect(() => {
    if (volume === 0 && !isMuted) {
      setIsMuted(true);
    } else if (volume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [volume, isMuted]);

  const focusTimeline = () => {
    setTimeout(() => {
      timelineRef.current?.focus({ preventScroll: true });
    }, 10);
  };

  useEffect(() => {
    const TIME_AND_VOLUME_SEEKBAR = 'INPUT';
    const SPACE_KEY = ' ';
    const FULLSCREEN_KEY = 'f';
    const EXIT_FULLSCREEN_KEY = 'Escape';
    const MUTE_KEY = 'm';
    const SEEK_FORWARD_KEY = 'ArrowRight';
    const SEEK_BACKWARD_KEY = 'ArrowLeft';
    const VOLUME_UP_KEY = 'ArrowUp';
    const VOLUME_DOWN_KEY = 'ArrowDown';

    const handleKeyDown = (event: KeyboardEvent) => {
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
          focusTimeline();
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
            focusTimeline();
            setCurrentTime(newTime);
            videoRef.current.seekTo(newTime);
            focusTimeline();
          }
          break;
        case SEEK_BACKWARD_KEY:
          if (videoRef.current) {
            const newTime = Math.max(videoRef.current.getCurrentTime() - 10, 0);
            setCurrentTime(newTime);
            videoRef.current.seekTo(newTime);
            focusTimeline();
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, toggleFullscreen, toggleMute]);

  if (!url || !ReactPlayer.canPlay(url)) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-900 rounded-lg text-white">
        Video couldn't be loaded. Try again later.
        {error && `Error: ${error}}`}
      </div>
    );
  }
  return (
    <div
      ref={videoContainerRef}
      className="relative w-full bg-black rounded-lg h-[56.25vh] mx-auto my-4" // 16:9 aspect ratio
      style={{
        aspectRatio: '16/9',
        maxHeight: '720px', // Standard YouTube height
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <ReactPlayer
          className="rounded-md"
          ref={videoRef}
          url={url}
          controls={false}
          playing={isPlaying}
          volume={volume}
          playbackRate={playbackRate}
          onClick={togglePlayPause}
          onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
          onDuration={(duration) => setDuration(duration)}
          onError={(e) => {
            setError(
              typeof e === 'string'
                ? e
                : e?.message ||
                    'An unknown error occurred while loading the video.'
            );
          }}
          width="100%"
          height="100%"
        />
      </div>
      {!error && <SearchBar onResultClick={(seekTime: number) => {
        if (videoRef.current) {
          setCurrentTime(seekTime);
          videoRef.current.seekTo(seekTime);
          setIsPlaying(true);
        }
      }}/>}
      {error && (
        <div className="flex items-center justify-center w-full h-full text-white">
          <div>
            <strong>Playback Error:</strong> {error}
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <SegmentsTimeline
          duration={duration}
          currentTime={currentTime}
          handleSeek={handleSeek}
          timelineRef={timelineRef}
          segments={
            segments.length > 0
              ? segments
              : [
                  {
                    start: 0,
                    end: duration,
                    color: '#2563EB',
                    title: '',
                    description: '',
                  },
                ]
          }
        />
      </div>

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
        playbackRate={playbackRate}
        setPlaybackRate={setPlaybackRate}
      />
    </div>
  );
};

export default VideoPlayer;
