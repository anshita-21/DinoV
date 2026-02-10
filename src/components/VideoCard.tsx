import { Video, Category } from '../types/video';
import { formatTime, getCachedDurationForSlug } from '../utils/videoUtils';
import './VideoCard.css';

interface VideoCardProps {
  readonly video: Video;
  readonly category: Category;
  readonly onClick: () => void;
}

export default function VideoCard({ video, category, onClick }: VideoCardProps) {
  const cachedDuration = getCachedDurationForSlug(video.slug);

  const effectiveDuration =
    typeof video.duration === 'number' && video.duration > 0
      ? video.duration
      : typeof cachedDuration === 'number' && cachedDuration > 0
        ? cachedDuration
        : undefined;

  return (
    <button
      className="video-card"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      type="button"
    >
      <div className="video-card-thumbnail">
        <img src={video.thumbnailUrl} alt={video.title} />
        {typeof effectiveDuration === 'number' && effectiveDuration > 0 && (
          <div className="video-card-duration">{formatTime(effectiveDuration)}</div>
        )}
      </div>
      <div className="video-card-content">
        <h3 className="video-card-title">{video.title}</h3>
        <div className="video-card-category">
          <img src={category.iconUrl} alt={category.name} className="category-icon" />
          <span>{category.name}</span>
        </div>
      </div>
    </button>
  );
}

