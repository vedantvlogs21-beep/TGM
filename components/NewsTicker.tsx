import React from 'react';
import { Translation, Language, Announcement } from '../types';
import { Bell } from 'lucide-react';

interface NewsTickerProps {
  announcements: Announcement[];
  t: Translation;
  lang: Language;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ announcements, t, lang }) => {
  // If no announcements, show default messages
  const displayItems = announcements.length > 0 
    ? announcements.map(a => a.message).filter(Boolean)
    : [
        lang === Language.MR 
          ? "द ग्रेट मराठा मित्र मंडळ अधिकृत वेबसाइटवर आपले स्वागत आहे."
          : "Welcome to The Great Maratha Mitra Mandal Official Website.",
        lang === Language.MR 
          ? "आगामी कार्यक्रमांच्या माहितीसाठी संपर्कात रहा."
          : "Stay tuned for upcoming events and information."
      ];

  const fullText = displayItems.join("  ✦  ");

  return (
    <div className="bg-saffron-800 text-white overflow-hidden flex items-center h-10 border-b border-saffron-900 relative z-40">
      <div className="bg-saffron-900 h-full px-4 flex items-center gap-2 z-10 shadow-lg shrink-0">
        <Bell size={16} className="text-saffron-200 animate-pulse" />
        <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${lang === Language.MR ? 'font-marathi' : ''}`}>
            {t.latest_updates}
        </span>
      </div>
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="animate-ticker absolute whitespace-nowrap text-sm font-medium">
          {fullText} { /* Repeat for smooth loop if short */ } &nbsp;&nbsp;&nbsp;&nbsp; {fullText}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;