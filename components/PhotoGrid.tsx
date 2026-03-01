import React, { useState, useEffect, useRef } from 'react';
import { Photo, Translation, Language } from '../types';
import { X, ZoomIn, Share2, Link as LinkIcon, Check, Facebook, Twitter, MessageCircle, Download } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  t: Translation;
  lang: Language;
  title?: string;
  id?: string;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, t, lang, title, id = "gallery" }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [sharePhoto, setSharePhoto] = useState<Photo | null>(null);
  const [copied, setCopied] = useState(false);

  // Refs for accessibility focus management
  const closeShareBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle Share Modal Accessibility (Focus management & Escape key)
  useEffect(() => {
    if (sharePhoto) {
      // Store currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus close button on open
      setTimeout(() => {
        closeShareBtnRef.current?.focus();
      }, 50);

      // Handle Escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSharePhoto(null);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        // Restore focus on close
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [sharePhoto]);

  // Handle Lightbox Accessibility (Escape key)
  useEffect(() => {
    if (selectedPhoto) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedPhoto(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedPhoto]);


  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getShareUrl = (photo: Photo) => {
    // If it's a remote URL, share the direct image link.
    // If it's local (base64) or blob, share the website URL as fallback.
    if (photo.url.startsWith('http')) return photo.url;
    return window.location.href;
  };

  const handleDownload = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    try {
      // Fetch the image as a blob to force download behavior
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `maratha-gallery-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      // Fallback: open in new tab if fetch fails (e.g. CORS)
      window.open(photo.url, '_blank');
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-white" id={id}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-5xl font-bold text-saffron-800 mb-4 ${lang === Language.MR ? 'font-marathi' : 'font-sans'}`}>
            {title || t.gallery}
          </h2>
          <div className="h-1 w-24 bg-saffron-500 mx-auto rounded-full mb-8"></div>
        </div>

        {/* Masonry Layout using CSS Columns */}
        {/* 'columns-xs' classes create the masonry columns. 'gap-4' sets space between columns. */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="break-inside-avoid mb-4 group relative overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gray-100"
              onClick={() => setSelectedPhoto(photo)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedPhoto(photo);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View photo ${photo.alt}`}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="text-white w-8 h-8" />
              </div>

              {/* Share Button (Top Right) */}
              <button
                className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-saffron-600 transition-all opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 z-20 focus:opacity-100 focus:translate-y-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setSharePhoto(photo);
                }}
                title={t.share}
                aria-label={`${t.share} photo`}
              >
                <Share2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.alt || "Photo view"}
          >
            {/* Header Controls */}
            <div className="absolute top-4 right-4 z-[110] flex items-center gap-4">
              {/* Download Button */}
              <button
                className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
                onClick={(e) => handleDownload(e, selectedPhoto)}
                title="Download Image"
                aria-label="Download image"
              >
                <Download size={32} />
              </button>

              {/* Close Button */}
              <button
                className="text-white hover:text-saffron-400 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-400 rounded-full"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close lightbox"
              >
                <X size={40} />
              </button>
            </div>

            {/* Click backdrop to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedPhoto(null)} aria-hidden="true"></div>

            <div className="max-w-6xl max-h-[90vh] relative z-[105] pointer-events-none flex flex-col items-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.alt}
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl pointer-events-auto"
              />
              <p className="mt-4 text-white text-lg font-medium opacity-90 text-center drop-shadow-md pointer-events-auto bg-black/50 px-4 py-1 rounded-full">
                {selectedPhoto.alt}
              </p>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {sharePhoto && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
          >
            <div className="absolute inset-0" onClick={() => setSharePhoto(null)} aria-hidden="true"></div>

            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative z-[130] animate-in slide-in-from-bottom-4 duration-300">
              <button
                ref={closeShareBtnRef}
                onClick={() => setSharePhoto(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500 rounded-full p-1"
                aria-label="Close share modal"
              >
                <X size={24} />
              </button>

              <h3
                id="share-modal-title"
                className={`text-xl font-bold mb-4 text-gray-800 ${lang === Language.MR ? 'font-marathi' : ''}`}
              >
                {t.share}
              </h3>

              {/* Thumbnail */}
              <div className="rounded-lg overflow-hidden h-40 mb-6 bg-gray-100 border border-gray-200" aria-hidden="true">
                <img src={sharePhoto.url} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Social Icons */}
              <div className="flex justify-around mb-6" role="list">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(getShareUrl(sharePhoto))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg p-1"
                  role="listitem"
                  aria-label="Share on WhatsApp"
                >
                  <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
                    <MessageCircle size={24} />
                  </div>
                  <span className="text-xs font-medium text-gray-500">WhatsApp</span>
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(sharePhoto))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
                  role="listitem"
                  aria-label="Share on Facebook"
                >
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <Facebook size={24} />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Facebook</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl(sharePhoto))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg p-1"
                  role="listitem"
                  aria-label="Share on Twitter"
                >
                  <div className="p-3 bg-sky-100 text-sky-500 rounded-full group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sm">
                    <Twitter size={24} />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Twitter</span>
                </a>
              </div>

              {/* Copy Link Input */}
              <div className="relative">
                <label
                  htmlFor="share-link-input"
                  className={`block text-xs font-medium text-gray-500 mb-1 ml-1 ${lang === Language.MR ? 'font-marathi' : ''}`}
                >
                  {t.copy_link}
                </label>
                <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-saffron-200 transition-all">
                  <input
                    id="share-link-input"
                    readOnly
                    value={getShareUrl(sharePhoto)}
                    className="flex-1 bg-transparent text-sm text-gray-600 outline-none truncate"
                  />
                  <button
                    onClick={() => handleCopy(getShareUrl(sharePhoto))}
                    className={`p-2 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-saffron-500 ${copied ? 'bg-green-100 text-green-600' : 'text-saffron-600 hover:bg-saffron-100'}`}
                    aria-label={copied ? "Link copied" : "Copy link to clipboard"}
                  >
                    {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                  </button>
                </div>
                {copied && (
                  <span
                    className={`absolute -bottom-5 right-0 text-xs text-green-600 font-medium animate-in fade-in slide-in-from-top-1 ${lang === Language.MR ? 'font-marathi' : ''}`}
                    role="status"
                  >
                    {t.copied}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGrid;