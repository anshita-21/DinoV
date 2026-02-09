import { Video } from "../types/video";

export function groupByCategory(videos: Video[]): Record<string, Video[]> {
  return videos.reduce((acc, video) => {
    if(!acc[video.category]) {
      acc[video.category] = [];
    }
    acc[video.category].push(video);
    return acc;
  }, {} as Record<string, Video[]>);
}