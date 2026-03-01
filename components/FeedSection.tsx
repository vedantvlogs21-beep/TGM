import React from 'react';
import { Translation, Language, Announcement } from '../types';
import { Calendar, Video, Image as ImageIcon, MessageSquare } from 'lucide-react';

interface FeedSectionProps {
  announcements: Announcement[];
  t: Translation;
  lang: Language;
}

const FeedSection: React.FC<FeedSectionProps> = ({ announcements, t, lang }) => {
  // Only show if there are announcements
  if (announcements.length === 0) return null;

  // Take the latest 3 items
  const displayItems = announcements.slice(0, 3);

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
            <h2 className={`text-3xl font-bold text-gray-800 ${lang === Language.MR ? 'font-marathi' : ''}`}>
            {t.latest_updates}
            </h2>
             {/* Optional: Add a "View All" link here if needed, triggering the modal via prop if we wanted to get fancy */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
              {/* Media Area */}
              <div className="relative aspect-video bg-black/5">
                {item.mediaUrl ? (
                   item.mediaType === 'video' ? (
                     <video 
                        src={item.mediaUrl} 
                        controls 
                        className="w-full h-full object-cover"
                     />
                   ) : (
                     <img 
                        src={item.mediaUrl} 
                        alt={item.message || 'Update'} 
                        className="w-full h-full object-cover"
                     />
                   )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={48} />
                    </div>
                )}
                
                {/* Type Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-saffron-600">
                    {item.mediaType === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">
                    <Calendar size={12} />
                    <span>{item.timestamp.toLocaleDateString()}</span>
                </div>
                
                {item.message && (
                    <div className="flex gap-3">
                        <MessageSquare size={16} className="text-gray-400 mt-1 shrink-0" />
                        <p className={`text-gray-700 whitespace-pre-wrap ${lang === Language.MR ? 'font-marathi text-lg' : ''}`}>
                            {item.message}
                        </p>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedSection;