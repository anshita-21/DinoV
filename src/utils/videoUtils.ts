import type { Video } from '../types/video';

export function extractVideoId(url: string): string {
  const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/);
  return match ? match[1] : '';
}

export function formatTime(seconds: number): string {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ---- Duration caching (by video slug), persisted in localStorage ----

type DurationCache = Record<string, number>;

const DURATION_CACHE_KEY = 'videoDurationCache';

let durationCache: DurationCache = {};

// Initialize cache from localStorage (if available)
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(DURATION_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DurationCache;
      if (parsed && typeof parsed === 'object') {
        durationCache = parsed;
      }
    }
  }
} catch {
  // Ignore storage errors
}

function persistDurationCache() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(DURATION_CACHE_KEY, JSON.stringify(durationCache));
    }
  } catch {
    // Ignore storage errors
  }
}

export function getCachedDurationForSlug(slug: string): number | undefined {
  return durationCache[slug];
}

export function setCachedDurationForSlug(slug: string, duration: number): void {
  if (!Number.isFinite(duration) || duration <= 0) return;
  durationCache[slug] = duration;
  persistDurationCache();
}

// Fetch and cache durations for multiple videos in the same category.
// Uses the YouTube IFrame API and creates a single hidden player per video, sequentially.
export async function fetchDurationsForVideos(videos: Pick<Video, 'slug' | 'mediaUrl'>[]): Promise<void> {
  if (!videos.length) return;

  // Only process videos that don't already have a cached duration
  const toFetch = videos.filter((v) => !getCachedDurationForSlug(v.slug));
  if (!toFetch.length) return;

  // Ensure YT API is available (VideoPlayer is responsible for loading it)
  if (!window.YT || !window.YT.Player) return;

  for (const video of toFetch) {
    const videoId = extractVideoId(video.mediaUrl);
    if (!videoId) continue;

    try {
      const duration = await fetchSingleVideoDuration(videoId);
      if (typeof duration === 'number' && duration > 0) {
        setCachedDurationForSlug(video.slug, duration);
      }
    } catch {
      // Ignore individual failures
    }
  }
}

function fetchSingleVideoDuration(videoId: string): Promise<number | null> {
  return new Promise((resolve) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '1px';
    tempDiv.style.height = '1px';
    document.body.appendChild(tempDiv);

    let resolved = false;
    const player = new window.YT.Player(tempDiv, {
      videoId,
      events: {
        onReady: (event: any) => {
          try {
            const dur = event.target.getDuration();
            if (!resolved) {
              resolved = true;
              resolve(Number.isFinite(dur) && dur > 0 ? dur : null);
            }
          } catch {
            if (!resolved) {
              resolved = true;
              resolve(null);
            }
          } finally {
            try {
              player.destroy();
            } catch {
              // ignore
            }
            if (tempDiv.parentNode) {
              tempDiv.parentNode.removeChild(tempDiv);
            }
          }
        },
        onError: () => {
          if (!resolved) {
            resolved = true;
            resolve(null);
          }
          try {
            player.destroy();
          } catch {
            // ignore
          }
          if (tempDiv.parentNode) {
            tempDiv.parentNode.removeChild(tempDiv);
          }
        },
      },
    });

    // Safety timeout
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(null);
        try {
          player.destroy();
        } catch {
          // ignore
        }
        if (tempDiv.parentNode) {
          tempDiv.parentNode.removeChild(tempDiv);
        }
      }
    }, 8000);
  });
}
