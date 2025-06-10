import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  file: File;
  coverUrl?: string;
}

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track) => void;
  onTrackRemove: (trackId: string) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  onTrackSelect,
  onTrackRemove,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
          <Icon name="Music" className="w-12 h-12 text-purple-400" />
        </div>
        <h3 className="text-xl font-montserrat font-semibold text-white mb-2">
          Ваша библиотека пуста
        </h3>
        <p className="text-purple-400">
          Загрузите треки чтобы начать слушать музыку
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-montserrat font-bold text-white">
          Ваша музыка
        </h2>
        <span className="text-purple-400 text-sm">
          {tracks.length} {tracks.length === 1 ? "трек" : "треков"}
        </span>
      </div>

      <div className="space-y-1">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`
              group flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 cursor-pointer
              ${
                currentTrack?.id === track.id
                  ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50"
                  : "hover:bg-purple-900/20 hover:border hover:border-purple-600/30"
              }
            `}
            onClick={() => onTrackSelect(track)}
          >
            {/* Track Number / Play Icon */}
            <div className="w-8 text-center">
              {currentTrack?.id === track.id ? (
                <div className="w-4 h-4 mx-auto">
                  <div className="flex space-x-1 items-center justify-center">
                    <div className="w-1 h-4 bg-purple-400 animate-pulse rounded-full"></div>
                    <div
                      className="w-1 h-2 bg-purple-400 animate-pulse rounded-full"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1 h-3 bg-purple-400 animate-pulse rounded-full"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              ) : (
                <span className="text-purple-400 text-sm group-hover:hidden">
                  {index + 1}
                </span>
              )}
              <Icon
                name="Play"
                className="w-4 h-4 text-white hidden group-hover:block mx-auto"
              />
            </div>

            {/* Cover */}
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              {track.coverUrl ? (
                <img
                  src={track.coverUrl}
                  alt="Cover"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Icon name="Music" className="text-white w-6 h-6" />
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate group-hover:text-purple-200">
                {track.title}
              </h3>
              <p className="text-sm text-purple-400 truncate">{track.artist}</p>
            </div>

            {/* Duration */}
            <div className="text-purple-400 text-sm flex-shrink-0">
              {formatTime(track.duration)}
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onTrackRemove(track.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-purple-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
            >
              <Icon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
