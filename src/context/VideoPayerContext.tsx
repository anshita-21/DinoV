import React, { createContext, useState, ReactNode, useCallback, useContext } from 'react';
import { Video, PlayerMode } from '../types/video';
import { video } from 'framer-motion/client';

interface VideoPlayerContextProps {
  currentVideo: Video | null;
  playerMode: PlayerMode;
  isPlaying: boolean;
  setCurrentVideo: (video: Video | null) => void;
  setPlayerMode: (mode: PlayerMode) => void;
  togglePlay: () => void;
  mimizePlayer: () => void;
  restorePlayer: () => void;
}

const videoPlayerContext = createContext<VideoPlayerContextProps | undefined>(undefined);

export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [playerMode, setPlayerMode] = useState<PlayerMode>('fullscreen');
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const minimizePlayer = useCallback(() => {
    setPlayerMode('mini');
  }, []);

  const restorePlayer = useCallback(() => {
    setPlayerMode('fullscreen');
  }, []);

  const contextValue: VideoPlayerContextProps = {
    currentVideo,
    playerMode,
    isPlaying,
    setCurrentVideo,
    setPlayerMode,
    togglePlay,
    mimizePlayer: minimizePlayer,
    restorePlayer
  };

  return (
    <videoPlayerContext.Provider value={contextValue}>
      {children}
    </videoPlayerContext.Provider>
  );
}

export function useVideoPlayerContext() {
  const context = useContext(videoPlayerContext);
  if (!context) {
    throw new Error('useVideoPlayerContext must be used within a VideoPlayerProvider');
  }
  return context;
}