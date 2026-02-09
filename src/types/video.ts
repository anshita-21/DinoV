export interface Video {
  id: number;
  title: string;
  thumbnail: string;
  thumbnailUrl: string;
  duration: number;
  category: string;
  videoUrl: string;
  mediaUrl: string;
  mediaType: string;
  slug: string;
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