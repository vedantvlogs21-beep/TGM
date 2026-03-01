import React from 'react';
import { Language } from '../types';

interface LanguageSwitchProps {
  currentLanguage: Language;
  onToggle: (lang: Language) => void;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ currentLanguage, onToggle }) => {
  return (
    <div className="flex items-center bg-saffron-100 rounded-full p-1 border border-saffron-300">
      <button
        onClick={() => onToggle(Language.EN)}
        className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${
          currentLanguage === Language.EN
            ? 'bg-saffron-600 text-white shadow-md'
            : 'text-saffron-800 hover:bg-saffron-200'
        }`}
      >
        English
      </button>
      <button
        onClick={() => onToggle(Language.MR)}
        className={`px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 font-marathi ${
          currentLanguage === Language.MR
            ? 'bg-saffron-600 text-white shadow-md'
            : 'text-saffron-800 hover:bg-saffron-200'
        }`}
      >
        मराठी
      </button>
    </div>
  );
};

export default LanguageSwitch;