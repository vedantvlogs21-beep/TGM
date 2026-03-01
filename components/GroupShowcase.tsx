import React from 'react';
import { Photo, Translation, Language } from '../types';
import { ArrowRight } from 'lucide-react';

interface GroupShowcaseProps {
  photos: Photo[];
  t: Translation;
  lang: Language;
  targetId?: string;
  onSeeMore?: () => void;
}

const GroupShowcase: React.FC<GroupShowcaseProps> = ({ photos, t, lang, targetId = 'gallery', onSeeMore }) => {
  // Function to scroll to the main gallery
  const scrollToGallery = () => {
    if (onSeeMore) {
      onSeeMore();
    }

    // Allow a small delay for state update/rendering if onSeeMore is present
    setTimeout(() => {
      const gallerySection = document.getElementById(targetId);
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-5xl font-bold text-saffron-800 mb-4 ${lang === Language.MR ? 'font-marathi' : 'font-sans'}`}>
            {t.group_highlights}
          </h2>
          <div className="h-1 w-32 bg-saffron-500 mx-auto rounded-full"></div>
        </div>

        {/* Highlight Grid - 1 Large, 2 Small */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Main Large Photo */}
          {photos[0] ? (
            <div className="h-64 md:h-full rounded-2xl overflow-hidden shadow-xl border-4 border-saffron-50 group relative">
              <img
                src={photos[0].url}
                alt={photos[0].alt}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white font-bold text-lg">{photos[0].alt}</p>
              </div>
            </div>
          ) : (
            <div className="h-64 md:h-full rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-200">
              <span className="text-gray-400">No photos available</span>
            </div>
          )}

          <div className="flex flex-col gap-6 h-full">
            {/* Top Right Photo */}
            {photos[1] ? (
              <div className="flex-1 rounded-2xl overflow-hidden shadow-xl border-4 border-saffron-50 group relative">
                <img
                  src={photos[1].url}
                  alt={photos[1].alt}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">{photos[1].alt}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-200">
                <span className="text-gray-400">Add more photos</span>
              </div>
            )}

            {/* Bottom Right Photo */}
            {photos[2] ? (
              <div className="flex-1 rounded-2xl overflow-hidden shadow-xl border-4 border-saffron-50 group relative">
                <img
                  src={photos[2].url}
                  alt={photos[2].alt}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">{photos[2].alt}</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-200">
                <span className="text-gray-400">Add more photos</span>
              </div>
            )}
          </div>
        </div>

        {/* See More Button */}
        <div className="flex justify-center">
          <button
            onClick={scrollToGallery}
            className="group flex items-center gap-2 px-8 py-3 bg-white border-2 border-saffron-500 text-saffron-600 font-bold rounded-full hover:bg-saffron-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl"
          >
            <span className={lang === Language.MR ? 'font-marathi text-lg' : ''}>
              {t.see_more}
            </span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default GroupShowcase;