import React from 'react';
import { Translation, Language } from '../types';
import { Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

interface FooterProps {
  t: Translation;
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ t, lang }) => {
  return (
    <footer className="bg-saffron-900 text-saffron-100 py-10 relative z-50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        <h4 className={`text-2xl font-bold mb-4 ${lang === Language.MR ? 'font-marathi' : ''}`}>
          {t.title}
        </h4>

        <p className={`text-saffron-200 mb-6 max-w-md mx-auto ${lang === Language.MR ? 'font-marathi' : ''}`}>
          {t.address_details}
        </p>

        <div className="flex gap-6 mb-6">
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron-200 hover:text-white hover:scale-110 transition-all"
          >
            <Facebook size={24} />
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron-200 hover:text-white hover:scale-110 transition-all"
          >
            <Instagram size={24} />
          </a>
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron-200 hover:text-white hover:scale-110 transition-all"
          >
            <Youtube size={24} />
          </a>
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron-200 hover:text-white hover:scale-110 transition-all"
          >
            <MessageCircle size={24} />
          </a>
        </div>

        <div className="w-16 h-0.5 bg-saffron-700 mb-6"></div>

        <p className={`text-sm opacity-80 ${lang === Language.MR ? 'font-marathi' : ''}`}>
          {t.copyright}
        </p>
      </div>
    </footer>
  );
};

export default Footer;