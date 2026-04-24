import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SimpleCarouselProps {
  children: React.ReactNode[];
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
}

export function SimpleCarousel({ 
  children, 
  autoplay = false, 
  interval = 5000,
  showDots = true 
}: SimpleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (autoplay) {
      resetTimeout();
      timeoutRef.current = setTimeout(
        () => setCurrentIndex((prevIndex) => 
          prevIndex === children.length - 1 ? 0 : prevIndex + 1
        ),
        interval
      );

      return () => {
        resetTimeout();
      };
    }
  }, [currentIndex, autoplay, interval, children.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      {/* Slides */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      {showDots && (
        null
      )}
    </div>
  );
}
