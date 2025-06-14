import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useNotices } from "@/hooks/useNotices";

// Array of gradient backgrounds to cycle through
const gradientBackgrounds = [
  "linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)",
  "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)",
  "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)",
  "linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)",
  "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
];

interface BannerCarouselProps {
  autoScroll?: boolean;
}

export default function BannerCarousel({ autoScroll = true }: BannerCarouselProps) {
  const { notices, isLoading } = useNotices();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Set up auto slide interval
  useEffect(() => {
    if (autoScroll && notices.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNextSlide(true);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoScroll, notices.length]);

  // Function to go to next slide
  const goToNextSlide = (isAutomatic = false) => {
    setIsAnimating(true);
    const nextIndex = (currentIndex + 1) % notices.length;
    
    // If we're at the last slide and going back to the first, and this is from auto-rotation
    const isLooping = currentIndex === notices.length - 1 && nextIndex === 0;
    
    if (isLooping && isAutomatic) {
      // Skip animation when cycling back to first slide in auto mode
      setIsAnimating(false);
    }
    
    setCurrentIndex(nextIndex);
    
    // Reset animation state after transition completes
    if (!isLooping || !isAutomatic) {
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  };

  // Function to go to previous slide
  const goToPrevSlide = () => {
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + notices.length) % notices.length);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Handle manual slide change
  const handleSlideChange = (index: number) => {
    // Don't change if it's the same slide
    if (index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    
    // Restart the interval when manually changing slides
    if (autoScroll && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        goToNextSlide(true);
      }, 5000);
    }
  };

  // Handle touch/swipe events
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const startDragTime = useRef<number>(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    startDragTime.current = Date.now();
    
    // Pause auto-rotation during manual interaction
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const diff = touchStartX.current - touchEndX.current;
    const timeDiff = Date.now() - startDragTime.current;
    const isQuickSwipe = timeDiff < 300;
    
    // Swipe detection - either a significant movement or a quick swipe
    if (diff > 50 || (isQuickSwipe && diff > 30)) {
      // Swipe left, go to next
      goToNextSlide();
    } else if (diff < -50 || (isQuickSwipe && diff < -30)) {
      // Swipe right, go to previous
      goToPrevSlide();
    }
    
    // Resume auto-rotation if enabled
    if (autoScroll && notices.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNextSlide(true);
      }, 5000);
    }
  };

  // Also handle mouse events for desktop browsers
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    isDragging.current = true;
    startDragTime.current = Date.now();
    
    // Pause auto-rotation during manual interaction
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };
  
  const handleMouseUp = () => {
    if (!isDragging.current) return;
    handleTouchEnd(); // Reuse the same logic as touch events
  };
  
  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleTouchEnd(); // Finish the drag operation if the mouse leaves during drag
    }
  };

  if (isLoading || notices.length === 0) {
    return (
      <div className="bg-gray-300 rounded-lg overflow-hidden relative h-48">
        <div className="absolute inset-0 p-4 flex flex-col justify-center">
          <p className="text-sm text-white">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-48 w-full">
        {notices.map((notice, index) => {
          // Get gradient background for this index
          const gradientBg = gradientBackgrounds[index % gradientBackgrounds.length];
          
          // Calculate transform and determine if visible
          let position = "translateX(100%)";
          const isCurrentSlide = index === currentIndex;
          const isPrevSlide = index === ((currentIndex - 1 + notices.length) % notices.length);
          const isNextSlide = index === ((currentIndex + 1) % notices.length);
          
          if (isCurrentSlide) {
            position = "translateX(0)";
          } else if (isPrevSlide) {
            position = "translateX(-100%)"; // Item to the left
          } else if (isNextSlide) {
            position = "translateX(100%)"; // Item to the right
          }
          
          return (
            <div 
              key={notice.id} 
              className={`absolute top-0 left-0 w-full h-full ${
                isAnimating ? "transition-transform duration-300 ease-in-out" : ""
              }`}
              style={{ 
                transform: position,
              }}
            >
              <div 
                className="rounded-lg overflow-hidden relative h-48 w-full"
                style={{ background: gradientBg }}
              >
                <div className="absolute inset-0 p-4 flex flex-col justify-center">
                  <p className="text-sm text-white">{notice.subtitle}</p>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {notice.title}
                  </h2>
                  <p className="text-2xl font-bold text-white">{notice.date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
