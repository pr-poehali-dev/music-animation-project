import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Icon from "@/components/ui/icon";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  file: File;
  coverUrl?: string;
}

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onTimeUpdate: (currentTime: number) => void;
  currentTime: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onTimeUpdate,
  currentTime,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState([0.7]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current;
      const url = URL.createObjectURL(currentTrack.file);
      audio.src = url;

      const handleTimeUpdate = () => {
        onTimeUpdate(audio.currentTime);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        URL.revokeObjectURL(url);
      };
    }
  }, [currentTrack, onTimeUpdate]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
    }
  }, [volume]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      onTimeUpdate(value[0]);
    }
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 cyberpunk-bg backdrop-blur-lg neon-border-green p-6">
        <div className="flex items-center justify-center neon-text">
          <Icon name="Music" className="mr-2" />
          Выберите трек для воспроизведения
        </div>
      </div>
    );
  }

  return (
    <>
      <audio ref={audioRef} />
      <div className="fixed bottom-0 left-0 right-0 cyberpunk-bg backdrop-blur-xl neon-border p-6 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={currentTrack.duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-purple-300 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-4 flex-1">
              <div
                className={`w-16 h-16 bg-gradient-to-br from-cyan-500 to-green-500 rounded-lg flex items-center justify-center neon-border ${isPlaying ? "animate-pulse" : ""}`}
              >
                {currentTrack.coverUrl ? (
                  <img
                    src={currentTrack.coverUrl}
                    alt="Cover"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Icon name="Music" className="text-white text-2xl" />
                )}
              </div>
              <div className="text-white">
                <h3 className="font-semibold text-lg truncate max-w-xs neon-text">
                  {currentTrack.title}
                </h3>
                <p className="neon-text-green text-sm truncate max-w-xs">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrevious}
                className="text-white hover:text-cyan-300 hover:bg-cyan-800/30 neon-border"
              >
                <Icon name="SkipBack" className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={onPlayPause}
                className="text-white hover:text-purple-300 hover:bg-purple-800/30 w-12 h-12 rounded-full"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                className="text-white hover:text-cyan-300 hover:bg-cyan-800/30 neon-border"
              >
                <Icon name="SkipForward" className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-2 flex-1 justify-end">
              <Icon name="Volume2" className="neon-text-green w-4 h-4" />
              <Slider
                value={volume}
                max={1}
                step={0.1}
                onValueChange={setVolume}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
