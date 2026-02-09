export interface Video {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
}

export type PlayerMode = 'fullscreen' | 'mini';

export interface VideoPlayerState {
  currentVideo: Video | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  mode: PlayerMode;
}