import { useRef, useState, useEffect, type RefObject } from "react";

interface UseSwipeGestureReturn {
  isRevealed: boolean;
  reveal: () => void;
  hide: () => void;
  containerRef: RefObject<HTMLDivElement>;
}

export function useSwipeGesture(): UseSwipeGestureReturn {
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const touchStartTime = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
      isDragging.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;

      touchEndY.current = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchEndY.current;
      const deltaTime = Date.now() - touchStartTime.current;
      const velocity = Math.abs(deltaY) / deltaTime;

      if (deltaY > 80 && !isRevealed && velocity > 0.1) {
        setIsRevealed(true);
        isDragging.current = false;
      } else if (deltaY < -80 && isRevealed && velocity > 0.1) {
        setIsRevealed(false);
        isDragging.current = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 50) {
        if (e.deltaY > 0 && !isRevealed) setIsRevealed(true);
        else if (e.deltaY < 0 && isRevealed) setIsRevealed(false);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isRevealed]);

  return {
    isRevealed,
    reveal: () => setIsRevealed(true),
    hide: () => setIsRevealed(false),
    containerRef,
  };
}
