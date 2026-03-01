import React from 'react';
import { X, Calendar, Image as ImageIcon, Video } from 'lucide-react';
import { Translation, Language, Announcement } from '../types';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
  t: Translation;
  lang: Language;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose, announcements, t, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[90] overflow-y-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-saffron-100 shadow-sm px-4 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3 text-saffron-700">
           <ImageIcon className="fill-current" />
           <h2 className={`text-xl font-bold ${lang === Language.MR ? 'font-marathi' : ''}`}>
             {t.announcements}
           </h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={28} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {announcements.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p className={lang === Language.MR ? 'font-marathi text-lg' : ''}>{t.no_announcements}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {announcements.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header of Card */}
                <div className="p-4 flex items-center justify-between text-sm text-gray-500 border-b border-gray-50">
                   <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{t.posted_on} {item.timestamp.toLocaleDateString()}</span>
                   </div>
                   {item.mediaType === 'video' && <Video size={16} />}
                </div>

                {/* Media */}
                {item.mediaUrl && (
                  <div className="w-full bg-black/5">
                    {item.mediaType === 'video' ? (
                      <video 
                        src={item.mediaUrl} 
                        controls 
                        className="w-full max-h-[500px] object-contain"
                      />
                    ) : (
                      <img 
                        src={item.mediaUrl} 
                        alt="Announcement" 
                        className="w-full max-h-[500px] object-contain"
                      />
                    )}
                  </div>
                )}

                {/* Text */}
                {item.message && (
                  <div className="p-5">
                    <p className={`text-gray-800 whitespace-pre-wrap leading-relaxed ${lang === Language.MR ? 'font-marathi text-lg' : ''}`}>
                      {item.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementModal;