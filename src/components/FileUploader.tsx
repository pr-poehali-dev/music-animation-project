import React, { useCallback, useState } from "react";
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

interface FileUploaderProps {
  onTracksAdded: (tracks: Track[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onTracksAdded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = useCallback(
    async (files: FileList) => {
      setIsProcessing(true);
      const tracks: Track[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("audio/")) {
          // Create audio element to get duration
          const audio = new Audio();
          const url = URL.createObjectURL(file);
          audio.src = url;

          try {
            await new Promise((resolve, reject) => {
              audio.addEventListener("loadedmetadata", resolve);
              audio.addEventListener("error", reject);
            });

            const track: Track = {
              id: `track-${Date.now()}-${i}`,
              title: file.name.replace(/\.[^/.]+$/, ""),
              artist: "Неизвестный исполнитель",
              duration: audio.duration,
              file: file,
            };

            tracks.push(track);
          } catch (error) {
            console.error("Error processing file:", file.name, error);
          } finally {
            URL.revokeObjectURL(url);
          }
        }
      }

      onTracksAdded(tracks);
      setIsProcessing(false);
    },
    [onTracksAdded],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
    },
    [processFiles],
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
          ${
            isDragging
              ? "border-purple-400 bg-purple-900/20 scale-105"
              : "border-purple-600/50 bg-purple-900/10 hover:bg-purple-900/20"
          }
          ${isProcessing ? "pointer-events-none opacity-50" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <div className="space-y-4">
          <div
            className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ${isProcessing ? "animate-pulse" : isDragging ? "animate-bounce" : ""}`}
          >
            <Icon
              name={isProcessing ? "Loader2" : "Upload"}
              className={`w-10 h-10 text-white ${isProcessing ? "animate-spin" : ""}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-montserrat font-semibold text-white mb-2">
              {isProcessing ? "Обрабатываем файлы..." : "Загрузите музыку"}
            </h3>
            <p className="text-purple-300">
              {isProcessing
                ? "Подождите, анализируем ваши треки"
                : "Перетащите файлы сюда или нажмите для выбора"}
            </p>
          </div>

          {!isProcessing && (
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-lg transform hover:scale-105 transition-all duration-200">
              <Icon name="FolderOpen" className="mr-2 w-5 h-5" />
              Выбрать файлы
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-purple-400">
          Поддерживаются форматы: MP3, WAV, FLAC, AAC, OGG
        </p>
      </div>
    </div>
  );
};

export default FileUploader;
