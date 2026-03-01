import React, { useState } from 'react';
import { Translation, Language } from '../types';
import { Info, Mail, Users, Facebook, Instagram, Youtube, MessageCircle, MapPin } from 'lucide-react';
import { SOCIAL_LINKS, CONTACT_EMAIL } from '../constants';

interface InfoSectionProps {
  t: Translation;
  lang: Language;
}

const InfoSection: React.FC<InfoSectionProps> = ({ t, lang }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMarathi = lang === Language.MR;

  return (
    <section className="py-20 bg-saffron-50/50">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-16">

        {/* About Card */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-saffron-100 border border-saffron-50 hover:-translate-y-2 transition-transform duration-300 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

          <div className="flex items-center mb-6 relative z-10">
            <div className="p-4 bg-gradient-to-br from-saffron-100 to-saffron-200 rounded-2xl text-saffron-700 mr-5 shadow-sm">
              <Users size={32} />
            </div>
            <h3 className={`text-3xl font-bold text-gray-800 ${isMarathi ? 'font-marathi' : ''}`}>
              {t.about}
            </h3>
          </div>
          <p className={`text-gray-600 leading-relaxed relative z-10 flex-grow whitespace-pre-line ${isMarathi ? 'font-marathi text-lg' : 'text-lg'}`}>
            {isExpanded ? t.about_content : `${t.about_content.slice(0, 300)}...`}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-saffron-600 font-semibold hover:text-saffron-800 transition-colors relative z-10 self-start"
          >
            {isExpanded ? t.see_less : t.read_more}
          </button>
        </div>

        {/* Contact Card */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-saffron-100 border border-saffron-50 hover:-translate-y-2 transition-transform duration-300 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

          <div className="flex items-center mb-6 relative z-10">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl text-blue-600 mr-5 shadow-sm">
              <Info size={32} />
            </div>
            <h3 className={`text-3xl font-bold text-gray-800 ${isMarathi ? 'font-marathi' : ''}`}>
              {t.contact}
            </h3>
          </div>
          <p className={`text-gray-600 mb-8 relative z-10 ${isMarathi ? 'font-marathi text-lg' : 'text-lg'}`}>
            {t.contact_info}
          </p>

          <div className="space-y-4 mb-8 relative z-10">
            <div className="flex items-start text-gray-700 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <Mail className="w-6 h-6 text-saffron-600 mr-4 mt-0.5" />
              <span className="font-medium">{CONTACT_EMAIL}</span>
            </div>

            <div className="flex items-start text-gray-700 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <MapPin className="w-6 h-6 text-saffron-600 mr-4 mt-0.5" />
              <span className={`font-medium ${isMarathi ? 'font-marathi' : ''}`}>
                {t.address_details}
              </span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="relative z-10 mt-auto">
            <h4 className={`text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ${isMarathi ? 'font-marathi' : ''}`}>
              {t.follow_us}
            </h4>
            <div className="flex gap-4">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
              >
                <Facebook size={24} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
              >
                <Instagram size={24} />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
              >
                <Youtube size={24} />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default InfoSection;