import React, { useState, useEffect } from 'react';
import { Photo, Language, Translation } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSliderProps {
  photos: Photo[];
  t: Translation;
  lang: Language;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto change logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 5000); // Changed to 5 seconds to allow zoom to breathe

    return () => clearInterval(interval);
  }, [photos.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-gray-900 group">
      {/* Slides */}
      <div
        className="w-full h-full relative"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <img
              src={photo.url}
              alt={photo.alt}
              className={`w-full h-full object-contain`}
            />
          </div>
        ))}
      </div>



      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${index === currentIndex ? 'bg-saffron-500 w-8 scale-110' : 'bg-white/50 hover:bg-white'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;