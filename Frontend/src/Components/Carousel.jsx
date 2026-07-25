import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fallbackGradients = [
  "bg-gradient-to-br from-primary via-primary-container to-secondary",
  "bg-gradient-to-br from-secondary-container via-primary to-tertiary-container",
  "bg-gradient-to-br from-tertiary-container via-secondary to-primary",
  "bg-gradient-to-br from-primary via-secondary-container to-primary-container",
];

export default function Carousel({ slides = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchCurrentX = useRef(null);

  const normalizedSlides = useMemo(() => slides.filter(Boolean), [slides]);

  useEffect(() => {
    if (activeIndex >= normalizedSlides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, normalizedSlides.length]);

  useEffect(() => {
    if (isPaused || normalizedSlides.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % normalizedSlides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isPaused, normalizedSlides.length]);

  const goToSlide = (nextIndex) => {
    if (!normalizedSlides.length) {
      return;
    }

    const total = normalizedSlides.length;
    setActiveIndex((nextIndex + total) % total);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    touchCurrentX.current = event.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (event) => {
    touchCurrentX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchCurrentX.current !== null) {
      const delta = touchCurrentX.current - touchStartX.current;
      if (Math.abs(delta) > 48) {
        goToSlide(activeIndex + (delta < 0 ? 1 : -1));
      }
    }

    touchStartX.current = null;
    touchCurrentX.current = null;
    setIsPaused(false);
  };

  if (!normalizedSlides.length) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-outline-variant bg-surface-lowest shadow-soft"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="relative h-60 sm:h-64 lg:h-72 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {normalizedSlides.map((slide, index) => {
            const gradientClass = fallbackGradients[index % fallbackGradients.length];

            return (
              <div key={`${slide.caption}-${index}`} className="relative h-full w-full shrink-0">
                {slide.src ? (
                  <img src={slide.src} alt={slide.caption} className="h-full w-full object-cover" />
                ) : (
                  <div className={`relative flex h-full w-full items-center justify-center ${gradientClass}`}>
                    <div className="absolute inset-0 bg-primary/55" />
                    <div className="relative mx-auto max-w-[20rem] px-8 text-center">
                      <p className="text-2xl font-bold leading-tight text-on-primary sm:text-3xl">{slide.caption}</p>
                    </div>
                  </div>
                )}

                {slide.src && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 via-primary/50 to-transparent px-5 pb-14 pt-10 sm:px-6">
                    <p className="text-lg font-bold leading-tight text-on-primary sm:text-xl">{slide.caption}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {normalizedSlides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goToSlide(activeIndex - 1)}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-on-surface/40 text-white transition-colors hover:bg-on-surface/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-on-primary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goToSlide(activeIndex + 1)}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-on-surface/40 text-white transition-colors hover:bg-on-surface/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-on-primary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-on-surface/25 px-3 py-2 backdrop-blur-sm">
            {normalizedSlides.map((slide, index) => (
              <button
                key={`${slide.caption}-dot-${index}`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={index === activeIndex}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-on-primary focus-visible:ring-offset-2 focus-visible:ring-offset-primary ${
                  index === activeIndex ? "w-6 bg-on-primary" : "w-2.5 bg-on-primary/45"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}