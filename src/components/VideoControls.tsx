import React, { useState, useRef } from 'react';
import { formatTime } from '../utils/videoUtils';
import './VideoControls.css';

interface VideoControlsProps {
  readonly isPlaying: boolean;
  readonly currentTime: number;
  readonly duration: number;
  readonly onPlayPause: () => void;
  readonly onSkipForward: () => void;
  readonly onSkipBackward: () => void;
  readonly onSeek: (time: number) => void;
  readonly videoThumbnail?: string;
  readonly showControls: boolean;
}

export default function VideoControls({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onSeek,
  videoThumbnail,
  showControls,
}: VideoControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
    const hoverTimeValue = percentage * duration;
    setHoverTime(hoverTimeValue);
    setPreviewPosition(percentage * 100);
    setShowPreview(true);
  };

  const handleProgressMouseLeave = () => {
    setShowPreview(false);
    setHoverTime(null);
  };

  const handleProgressKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const delta = e.key === 'ArrowLeft' ? -5 : 5;
      const newTime = Math.max(0, Math.min(currentTime + delta, duration));
      onSeek(newTime);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPlayPause();
    }
  };

  return (
    <div className="video-controls">
      {/* Top controls: -10 / play-pause / +10 */}
      <div className={`top-controls ${showControls ? 'visible' : 'hidden'}`}>
        <button
          className="control-btn small"
          onClick={onSkipBackward}
          aria-label="Skip backward 10 seconds"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            <path d="M10 9v6l5-3-5-3z"/>
          </svg>
          <span>-10</span>
        </button>

        <button
          className="control-btn play-pause"
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <button
          className="control-btn small"
          onClick={onSkipForward}
          aria-label="Skip forward 10 seconds"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
            <path d="M14 9v6l-5-3 5-3z"/>
          </svg>
          <span>+10</span>
        </button>
      </div>

      {/* Bottom controls: progress bar + time */}
      <div className={`bottom-controls ${showControls ? 'visible' : 'hidden'}`}>
        <div
          ref={progressBarRef}
          className="progress-bar-container"
          onClick={handleProgressClick}
          onMouseMove={handleProgressMouseMove}
          onMouseLeave={handleProgressMouseLeave}
          onKeyDown={handleProgressKeyDown}
          role="progressbar"
          tabIndex={0}
          aria-label="Video progress"
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
        >
          <div className="progress-bar">
            <div className="progress-bar-filled" style={{ width: `${progress}%` }} />
          </div>

          {/* Progress preview card */}
          {showPreview && hoverTime !== null && (
            <div
              className="progress-preview-card"
              style={{ left: `${previewPosition}%` }}
            >
              {videoThumbnail && (
                <img src={videoThumbnail} alt="Preview" className="preview-thumbnail" />
              )}
              <div className="preview-time">{formatTime(hoverTime)}</div>
            </div>
          )}
        </div>

        <div className="controls-row">
          <div className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
}
