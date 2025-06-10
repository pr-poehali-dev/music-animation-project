import React, { useState, useCallback } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import FileUploader from "@/components/FileUploader";
import TrackList from "@/components/TrackList";
import LyricsPanel from "@/components/LyricsPanel";
import Icon from "@/components/ui/icon";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  file: File;
  coverUrl?: string;
}

const Index = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  const handleTracksAdded = useCallback(
    (newTracks: Track[]) => {
      setTracks((prev) => [...prev, ...newTracks]);
      if (!currentTrack && newTracks.length > 0) {
        setCurrentTrack(newTracks[0]);
      }
    },
    [currentTrack],
  );

  const handleTrackSelect = useCallback((track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  const handleTrackRemove = useCallback(
    (trackId: string) => {
      setTracks((prev) => {
        const newTracks = prev.filter((t) => t.id !== trackId);
        if (currentTrack?.id === trackId) {
          const currentIndex = prev.findIndex((t) => t.id === trackId);
          const nextTrack =
            newTracks[currentIndex] || newTracks[currentIndex - 1] || null;
          setCurrentTrack(nextTrack);
          setIsPlaying(false);
          setCurrentTime(0);
        }
        return newTracks;
      });
    },
    [currentTrack],
  );

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [tracks, currentTrack]);

  const handlePrevious = useCallback(() => {
    if (tracks.length === 0) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(tracks[prevIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [tracks, currentTrack]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full animate-pulse"></div>
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-indigo-600/10 to-purple-600/10 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 pb-32 ${showLyrics ? "pr-96" : ""} transition-all duration-300`}
      >
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
                <Icon name="Music" className="text-white text-2xl" />
              </div>
            </div>
            <h1 className="text-5xl font-montserrat font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Music Space
            </h1>
            <p className="text-xl text-purple-300 max-w-2xl mx-auto">
              Загружайте и слушайте свою музыку с красивыми анимациями и
              синхронизированными текстами
            </p>
          </div>

          {/* File Uploader */}
          {tracks.length === 0 && (
            <div className="mb-12">
              <FileUploader onTracksAdded={handleTracksAdded} />
            </div>
          )}

          {/* Track List */}
          {tracks.length > 0 && (
            <div className="max-w-4xl mx-auto">
              {tracks.length > 0 && (
                <div className="mb-8 text-center">
                  <FileUploader onTracksAdded={handleTracksAdded} />
                </div>
              )}
              <TrackList
                tracks={tracks}
                currentTrack={currentTrack}
                onTrackSelect={handleTrackSelect}
                onTrackRemove={handleTrackRemove}
              />
            </div>
          )}
        </div>
      </div>

      {/* Music Player */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onTimeUpdate={setCurrentTime}
        currentTime={currentTime}
      />

      {/* Lyrics Panel */}
      <LyricsPanel
        currentTrack={currentTrack}
        currentTime={currentTime}
        isVisible={showLyrics}
        onToggle={() => setShowLyrics((prev) => !prev)}
      />
    </div>
  );
};

export default Index;
