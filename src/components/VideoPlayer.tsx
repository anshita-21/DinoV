import { useEffect, useRef, useState } from "react";
import { Video, CategoryData } from "../types/video";
import VideoControls from "./VideoControls";
import VideoList from "./VideoList";
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import {
  extractVideoId,
  setCachedDurationForSlug,
  fetchDurationsForVideos,
} from "../utils/videoUtils";
import "./VideoPlayer.css";

interface VideoPlayerProps {
  video: Video;
  categoryData: CategoryData[];
  onClose: () => void;
  onVideoSelect: (video: Video) => void;
}

export default function VideoPlayer({
  video,
  categoryData,
  onClose,
  onVideoSelect,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const iframeRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isRevealed, containerRef, hide } = useSwipeGesture();

  /* ESC KEY CLOSE */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isRevealed) {
        hide();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isRevealed, hide]);

  useEffect(() => {
    function initPlayer() {
      if (!iframeRef.current) return;

      const videoId = extractVideoId(video.mediaUrl);
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId,
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0 },
        events: {
          onReady: (e: any) => {
            playerRef.current = e.target;
            const dur = e.target.getDuration();
            setDuration(dur);
            if (video.slug) setCachedDurationForSlug(video.slug, dur);

            const cat = categoryData.find((c) =>
              c.contents.some((v) => v.slug === video.slug),
            );
            if (cat) fetchDurationsForVideos(cat.contents);

            e.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (e: any) => {
            setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    }

    if (!window.YT || !window.YT.Player) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    const interval = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 250);

    return () => {
      clearInterval(interval);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [video]);

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleRelatedSelect = (newVideo: Video) => {
    hide(); // 🔑 close panel
    const videoId = extractVideoId(newVideo.mediaUrl);
    playerRef.current.loadVideoById(videoId);
    playerRef.current.playVideo();
    setIsPlaying(true);
    onVideoSelect(newVideo);
  };

  return (
    <div className="video-player" ref={isRevealed ? null : containerRef}>
      <button className="close-button" onClick={onClose}>
        ✕
      </button>

      <div
        className={`video-container ${isRevealed ? "revealed" : ""}`}
        onClick={() => (isRevealed ? hide() : showControlsTemporarily())}
        onTouchStart={() => (isRevealed ? hide() : showControlsTemporarily())}
        onMouseMove={showControlsTemporarily}
      >
        <div ref={iframeRef} className="video-iframe" />

        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={() =>
            isPlaying
              ? playerRef.current.pauseVideo()
              : playerRef.current.playVideo()
          }
          onSkipForward={() => playerRef.current.seekTo(currentTime + 10, true)}
          onSkipBackward={() =>
            playerRef.current.seekTo(Math.max(0, currentTime - 10), true)
          }
          onSeek={(t) => playerRef.current.seekTo(t, true)}
          videoThumbnail={video.thumbnailUrl}
          showControls={showControls && !isRevealed}
        />
      </div>

      <VideoList
        currentVideo={video}
        categoryData={categoryData}
        isRevealed={isRevealed}
        onVideoSelect={handleRelatedSelect}
      />
    </div>
  );
}
