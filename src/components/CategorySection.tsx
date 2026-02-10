import { CategoryData, Video } from '../types/video';
import VideoCard from './VideoCard';
import './CategorySection.css';

interface CategorySectionProps {
  readonly categoryData: CategoryData;
  readonly onVideoClick: (video: Video) => void;
}

export default function CategorySection({ categoryData, onVideoClick }: CategorySectionProps) {
  return (
    <div className="category-section">
      <div className="category-header">
        <img src={categoryData.category.iconUrl} alt={categoryData.category.name} className="category-header-icon" />
        <h2 className="category-title">{categoryData.category.name}</h2>
      </div>
      <div className="category-videos">
        {categoryData.contents.map((video) => (
          <VideoCard
            key={video.slug}
            video={video}
            category={categoryData.category}
            onClick={() => {
              console.log('[CategorySection] home card click', video.slug);
              onVideoClick(video);
            }}
          />
        ))}
      </div>
    </div>
  );
}

