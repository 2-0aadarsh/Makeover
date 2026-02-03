import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

const AUTO_SLIDE_INTERVAL_MS = 5000;
const SLIDE_DURATION_S = 0.5;

export default function TestimonialsCarousel({ testimonials = [], visibleCount = 3 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(visibleCount);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [instantTransition, setInstantTransition] = useState(false);
  const containerRef = useRef(null);
  const isTransitioning = useRef(false);
  const justJumpedFromZero = useRef(false);

  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      // 1 card: small screens. 2 cards: tablet + small desktop (768–1279). 3 cards: only on wide (1280+)
      // Avoids squeezed/ruined cards at 768px and 1024px
      if (w < 768) setVisible(1);
      else if (w < 1280) setVisible(2);
      else setVisible(visibleCount);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, [visibleCount]);

  const total = testimonials.length;
  // Never show more slots than we have items: avoids same review appearing twice when e.g. 1 review + 2 visible
  const effectiveVisible = Math.min(visible, total) || visible;
  const needsInfiniteLoop = total > visible;
  // Only duplicate list for infinite loop; otherwise single copy so no duplicate cards in view
  const displayList =
    total > 0
      ? needsInfiniteLoop
        ? [...testimonials, ...testimonials]
        : testimonials
      : [];
  const totalDisplay = displayList.length;
  const numSlides = total <= visible ? 1 : Math.ceil(total / visible);
  const shouldSlide = total > visible;

  // Logical index for dots/counter (when at duplicate we show as 0)
  const logicalIndex = currentIndex === total ? 0 : currentIndex;
  // translateX as % of strip width (strip has totalDisplay cards; each = 100/totalDisplay %)
  const translateXPercent =
    totalDisplay > 0 ? -(currentIndex * 100) / totalDisplay : 0;

  const goTo = useCallback(
    (index) => {
      if (!shouldSlide || isTransitioning.current) return;
      isTransitioning.current = true;
      const clamped = Math.min(Math.max(0, index), total - 1);
      setCurrentIndex(clamped);
      setInstantTransition(false);
      setTimeout(() => {
        isTransitioning.current = false;
      }, SLIDE_DURATION_S * 1000 + 100);
    },
    [shouldSlide, total]
  );

  const goNext = useCallback(() => {
    if (!shouldSlide || isTransitioning.current) return;
    isTransitioning.current = true;
    setInstantTransition(false);
    setCurrentIndex((prev) => (prev + 1 > total ? total : prev + 1));
    setTimeout(() => {
      isTransitioning.current = false;
    }, SLIDE_DURATION_S * 1000 + 100);
  }, [shouldSlide, total]);

  const goPrev = useCallback(() => {
    if (!shouldSlide || isTransitioning.current) return;
    isTransitioning.current = true;
    if (currentIndex === 0) {
      justJumpedFromZero.current = true;
      setInstantTransition(true);
      setCurrentIndex(total);
    } else {
      setInstantTransition(false);
      setCurrentIndex((prev) => prev - 1);
    }
    setTimeout(() => {
      isTransitioning.current = false;
    }, SLIDE_DURATION_S * 1000 + 100);
  }, [shouldSlide, total, currentIndex]);

  // When we've animated to the duplicate (currentIndex === total), reset to 0 without animation
  const onStripAnimationComplete = useCallback(() => {
    if (currentIndex === total) {
      setInstantTransition(true);
      setCurrentIndex(0);
    }
  }, [currentIndex, total]);

  // After instant reset to 0, re-enable transitions on next frame
  useEffect(() => {
    if (instantTransition) {
      const id = requestAnimationFrame(() => {
        setInstantTransition(false);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [instantTransition]);

  // When we jumped to total for prev, now animate back to total-1
  useEffect(() => {
    if (!justJumpedFromZero.current || currentIndex !== total) return;
    const id = requestAnimationFrame(() => {
      justJumpedFromZero.current = false;
      setCurrentIndex(total - 1);
      setInstantTransition(false);
    });
    return () => cancelAnimationFrame(id);
  }, [currentIndex, total]);

  useEffect(() => {
    if (!shouldSlide || numSlides <= 1 || !isAutoPlaying) return;
    const intervalId = setInterval(goNext, AUTO_SLIDE_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [shouldSlide, numSlides, isAutoPlaying, goNext]);

  if (!testimonials.length) {
    return null;
  }

  const currentSlide = Math.min(
    Math.floor(logicalIndex / visible),
    numSlides - 1
  );

  const isSingleCard = totalDisplay === 1;

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden"
      role="region"
      aria-label="Customer testimonials"
    >
      <div className="relative min-h-[320px] mb-12 px-2">
        {/* Viewport: only this width is visible; strip slides inside. Single card = centered, max-width */}
        <div
          className={`w-full overflow-hidden ${isSingleCard ? "max-w-lg mx-auto" : ""}`}
        >
          <motion.div
            className="flex"
            style={{
              width: `${(totalDisplay / effectiveVisible) * 100}%`,
            }}
            animate={{
              x: `${translateXPercent}%`,
            }}
            transition={
              instantTransition
                ? { duration: 0 }
                : {
                    type: "tween",
                    duration: SLIDE_DURATION_S,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
            onAnimationComplete={onStripAnimationComplete}
          >
            {displayList.map((testimonial, index) => (
              <div
                key={`${testimonial._id || testimonial.id || index}-${index}`}
                className="flex-shrink-0 px-2 box-border"
                style={{
                  width: `${100 / totalDisplay}%`,
                  minWidth: 0,
                  minHeight: 0,
                }}
              >
                <div className="h-full">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced navigation arrows with shadow */}
        {shouldSlide && numSlides > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4
                        w-10 h-10 md:w-12 md:h-12 rounded-full 
                        bg-white border border-gray-300
                        flex items-center justify-center
                        text-gray-600 hover:text-white hover:bg-[#CC2B52] hover:border-[#CC2B52]
                        transition-all duration-300 shadow-lg hover:shadow-xl
                        hover:shadow-[#CC2B52]/20 z-10
                        group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous testimonial"
              disabled={isTransitioning.current}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg 
                className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>
            
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4
                        w-10 h-10 md:w-12 md:h-12 rounded-full 
                        bg-white border border-gray-300
                        flex items-center justify-center
                        text-gray-600 hover:text-white hover:bg-[#CC2B52] hover:border-[#CC2B52]
                        transition-all duration-300 shadow-lg hover:shadow-xl
                        hover:shadow-[#CC2B52]/20 z-10
                        group disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next testimonial"
              disabled={isTransitioning.current}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Enhanced pagination with better design */}
      {shouldSlide && numSlides > 1 && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            {Array.from({ length: numSlides }).map((_, i) => {
              const isActive = currentSlide === i;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${i + 1}`}
                  className="group relative"
                  onClick={() => goTo(i * visible)}
                  disabled={isTransitioning.current}
                >
                  <div className="relative">
                    <div 
                      className={`w-2 h-2 rounded-full transition-all duration-300
                                ${isActive 
                                  ? 'bg-[#CC2B52]' 
                                  : 'bg-gray-300 group-hover:bg-gray-400'
                                }`}
                    />
                    {isActive && (
                      <motion.div 
                        className="absolute inset-0 rounded-full bg-[#CC2B52]/20"
                        layoutId="activeDot"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-4 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="text-gray-800 font-medium text-sm">
              <span className="text-[#CC2B52] font-semibold">{currentSlide + 1}</span>
              <span className="mx-1.5 text-gray-400">/</span>
              <span>{numSlides}</span>
            </span>
            
            {/* Divider */}
            <div className="w-px h-4 bg-gray-300" />
            
            {/* Auto-play toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`w-7 h-7 rounded-full flex items-center justify-center
                        border transition-all duration-300
                        ${isAutoPlaying 
                          ? 'border-[#CC2B52] bg-[#CC2B52]/10 text-[#CC2B52]' 
                          : 'border-gray-300 bg-white text-gray-500 hover:border-[#CC2B52]'
                        }`}
              aria-label={isAutoPlaying ? "Pause auto-slide" : "Resume auto-slide"}
            >
              {isAutoPlaying ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}