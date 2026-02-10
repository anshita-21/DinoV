import { useState } from 'react';
import { Video, CategoryData } from './types/video';
import { videoData } from './data/videos';
import CategorySection from './components/CategorySection';
import VideoPlayer from './components/VideoPlayer';
import './styles/index.css';
import './App.css';

function App() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="app">
      {selectedVideo ? (
        <VideoPlayer
          video={selectedVideo}
          categoryData={videoData}
          onClose={handleClosePlayer}
          onVideoSelect={handleVideoSelect}
        />
      ) : (
        <div className="home-page">
          <header className="app-header">
            <h1>Video Feed</h1>
          </header>
          <main className="main-content">
            {videoData.map((categoryData: CategoryData) => (
              <CategorySection
                key={categoryData.category.slug}
                categoryData={categoryData}
                onVideoClick={handleVideoClick}
              />
            ))}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;

