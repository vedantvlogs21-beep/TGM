import React from 'react';
import { X, GraduationCap, Megaphone, QrCode } from 'lucide-react';
import { Translation, Language } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudentPortal: () => void;
  onOpenAnnouncements: () => void;
  onOpenShareQR: () => void;
  t: Translation;
  lang: Language;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onOpenStudentPortal, onOpenAnnouncements, onOpenShareQR, t, lang }) => {


  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h2 className={`font-bold text-saffron-800 ${lang === Language.MR ? 'font-marathi' : ''}`}>{t.menu}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {/* Student Portal Button */}
          <button
            onClick={() => {
              onOpenStudentPortal();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-saffron-50 text-gray-700 hover:text-saffron-700 transition-colors"
          >
            <GraduationCap size={20} />
            <span className={`font-medium ${lang === Language.MR ? 'font-marathi' : ''}`}>
              {t.student_portal}
            </span>
          </button>

          {/* Announcements Button */}
          <button
            onClick={() => {
              onOpenAnnouncements();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-saffron-50 text-gray-700 hover:text-saffron-700 transition-colors"
          >
            <Megaphone size={20} />
            <span className={lang === Language.MR ? 'font-marathi' : ''}>{t.announcements}</span>
          </button>




          {/* Share/QR Button */}
          <button
            onClick={() => {
              onOpenShareQR();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-saffron-50 text-gray-700 hover:text-saffron-700 transition-colors"
          >
            <QrCode size={20} />
            <span className={lang === Language.MR ? 'font-marathi' : ''}>
              {lang === Language.MR ? 'शेअर / QR कोड' : 'Share / QR Code'}
            </span>
          </button>

        </div>
      </div>
    </>
  );
};

export default SideMenu;