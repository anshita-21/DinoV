import { CategoryData, Video } from "../types/video";
import VideoCard from "./VideoCard";
import "./VideoList.css";

interface Props {
  currentVideo: Video;
  categoryData: CategoryData[];
  isRevealed: boolean;
  onVideoSelect: (video: Video) => void;
}

export default function VideoList({
  currentVideo,
  categoryData,
  isRevealed,
  onVideoSelect,
}: Props) {

  const currentCategory = categoryData.find((cat) =>
    cat.contents.some((v) => v.slug === currentVideo.slug),
  );

  const relatedVideos = currentCategory?.contents
      .filter((v) => v.slug !== currentVideo.slug)
      .map((v) => ({
        video: v,
        category: currentCategory.category,
      })) || [];

  return (
    <div className={`video-list ${isRevealed ? "revealed" : ""}`}>
      <div className="video-list-handle" />

      <div className="video-list-header">
        <h3>Related videos</h3>
      </div>

      <div className="video-list-content">
        {relatedVideos.map(({ video, category }) => (
          <VideoCard
            key={video.slug}
            video={video}
            category={category}
            onClick={() => onVideoSelect(video)}
          />
        ))}
      </div>
    </div>
  );
}
