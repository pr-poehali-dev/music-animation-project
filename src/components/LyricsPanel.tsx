import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  file: File;
  coverUrl?: string;
}

interface LyricsPanelProps {
  currentTrack: Track | null;
  currentTime: number;
  isVisible: boolean;
  onToggle: () => void;
}

const LyricsPanel: React.FC<LyricsPanelProps> = ({
  currentTrack,
  currentTime,
  isVisible,
  onToggle,
}) => {
  const [lyrics, setLyrics] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  // Mock lyrics for demonstration
  const mockLyrics = `[00:15] Где-то далеко звучит мелодия
[00:22] Что зовет меня за собой
[00:30] В этом мире полном гармонии
[00:37] Я найду свой путь домой

[00:45] И пусть ветер поет о свободе
[00:52] Унося все печали прочь
[01:00] В этой песне, в этой природе
[01:07] Я найду спокойную ночь

[01:15] Припев:
[01:18] Лети, музыка моя
[01:22] Через горы и моря
[01:26] Донеси мои слова
[01:30] До того, кто ждет меня

[01:45] Каждый звук как капля дождя
[01:52] Омывает душу мою
[02:00] И мелодия ведет меня
[02:07] К тому, что я люблю`;

  useEffect(() => {
    if (currentTrack && !lyrics) {
      // In a real app, you'd fetch lyrics from an API
      setLyrics(mockLyrics);
    }
  }, [currentTrack, lyrics, mockLyrics]);

  const parseLyrics = (lyricsText: string) => {
    const lines = lyricsText.split("\n");
    return lines.map((line) => {
      const match = line.match(/\[(\d{2}):(\d{2})\]\s*(.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const time = minutes * 60 + seconds;
        return { time, text: match[3] };
      }
      return { time: 0, text: line };
    });
  };

  const parsedLyrics = parseLyrics(lyrics);
  const currentLineIndex = parsedLyrics.findIndex((line, index) => {
    const nextLine = parsedLyrics[index + 1];
    return (
      currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
    );
  });

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed right-6 top-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-12 h-12 z-10"
      >
        <Icon name="FileText" className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={onToggle}
        className="fixed right-6 top-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-12 h-12 z-20"
      >
        <Icon name="X" className="w-5 h-5" />
      </Button>

      <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-l border-purple-500/30 z-10 overflow-hidden">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-montserrat font-bold text-white">
              Текст песни
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-purple-300 hover:text-white hover:bg-purple-800/30"
            >
              <Icon name={isEditing ? "Check" : "Edit"} className="w-4 h-4" />
            </Button>
          </div>

          {currentTrack ? (
            <div className="flex-1 overflow-hidden">
              <div className="mb-4 p-4 bg-purple-800/20 rounded-lg border border-purple-600/30">
                <h3 className="font-semibold text-white truncate">
                  {currentTrack.title}
                </h3>
                <p className="text-purple-300 text-sm truncate">
                  {currentTrack.artist}
                </p>
              </div>

              {isEditing ? (
                <Textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Вставьте текст песни здесь..."
                  className="h-full bg-purple-900/30 border-purple-600/50 text-white placeholder-purple-400 resize-none"
                />
              ) : (
                <div className="h-full overflow-y-auto space-y-2 pr-2">
                  {parsedLyrics.length > 0 ? (
                    parsedLyrics.map((line, index) => (
                      <div
                        key={index}
                        className={`
                          p-3 rounded-lg transition-all duration-300 cursor-pointer
                          ${
                            index === currentLineIndex
                              ? "bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-purple-400/50 text-white font-medium scale-105 shadow-lg"
                              : "text-purple-300 hover:text-white hover:bg-purple-800/20"
                          }
                        `}
                      >
                        {line.text}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-purple-400 mt-12">
                      <Icon
                        name="FileText"
                        className="w-12 h-12 mx-auto mb-4 opacity-50"
                      />
                      <p>Текст не найден</p>
                      <p className="text-sm mt-2">
                        Нажмите на редактировать чтобы добавить
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <Icon
                  name="Music"
                  className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50"
                />
                <p className="text-purple-400">Выберите трек</p>
                <p className="text-purple-500 text-sm mt-2">
                  чтобы увидеть текст песни
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LyricsPanel;
