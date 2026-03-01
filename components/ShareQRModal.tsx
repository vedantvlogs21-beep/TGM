import React from 'react';
import QRCode from "react-qr-code";
import { X, Copy, ScanLine, Mail, Instagram } from 'lucide-react';
import { Translation, Language } from '../types';
import logo from '../assets/logo-v2.jpg';
import flagBg from '../assets/indian-flag.jpg';

interface ShareQRModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: Translation;
    lang: Language;
}

// Custom realistic sword SVG component (Bhavani Talwar style)
const MarathaSword = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
        </defs>
        {/* Hilt (Handle) - Gold */}
        <path d="M20 80 C 15 85, 10 90, 15 95 C 20 100, 25 95, 30 90 L 35 85" fill="url(#goldGradient)" stroke="#78350f" strokeWidth="1" />
        <path d="M30 80 L 25 85" stroke="#78350f" strokeWidth="2" />
        {/* Guard - Gold & Ornate */}
        <path d="M15 75 Q 25 65 35 75 T 45 85" fill="none" stroke="url(#goldGradient)" strokeWidth="3" />
        {/* Blade - Curved Steel */}
        <path d="M35 75 Q 60 50 90 10 Q 70 40 45 80" fill="url(#bladeGradient)" stroke="#475569" strokeWidth="0.5" />
        {/* Shine on blade */}
        <path d="M40 70 Q 60 50 85 15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
    </svg>
);

const ShareQRModal: React.FC<ShareQRModalProps> = ({ isOpen, onClose, t, lang }) => {
    if (!isOpen) return null;

    const currentUrl = window.location.href;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentUrl);
        // You might want to add a toast notification here in a real app
        alert(lang === Language.MR ? 'लिंक कॉपी केली!' : t.copied + '!');
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-500">
            {/* Atmospheric Particles (Background) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-saffron-400 rounded-full animate-ping opacity-20 duration-[3000ms]"></div>
                <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-amber-300 rounded-full animate-pulse opacity-20 duration-[4000ms]"></div>
                <div className="absolute bottom-10 left-1/2 w-32 h-32 bg-saffron-500/10 blur-[100px] rounded-full"></div>
            </div>

            <div
                className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col max-h-[90vh] ring-4 ring-white/10 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Premium Saffron Gradient with Texture */}
                <div className="relative p-8 overflow-hidden group h-32 flex items-center">
                    {/* Dynamic Backgrounds */}
                    <div className="absolute inset-0 bg-gradient-to-br from-saffron-600 via-saffron-500 to-amber-600 opacity-100"></div>

                    {/* Indian Flag Texture Blend */}
                    <div className="absolute inset-0 opacity-25 mix-blend-overlay grayscale hover:grayscale-0 transition-all duration-1000 scale-110 origin-bottom">
                        <img src={flagBg} alt="Background" className="w-full h-full object-cover" />
                    </div>

                    {/* Animated Golden Header Shapes */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full blur-3xl mix-blend-overlay opacity-60 animate-pulse duration-5000"></div>

                    {/* Content */}
                    <div className="relative z-10 flex justify-between items-center w-full">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-2 rounded-2xl shadow-lg border border-white/30 w-fit backdrop-blur-md animate-in slide-in-from-left-4 duration-700">
                                <img src={logo} alt="Logo" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                            </div>
                            <h2 className={`text-3xl font-extrabold leading-none text-white drop-shadow-md tracking-tight animate-in slide-in-from-bottom-2 duration-700 delay-100 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                {lang === Language.MR ? 'शेअर करा' : 'Share'}
                            </h2>
                            {/* Animated Sword */}
                            {/* Animated Realistic Sword */}
                            <div className="absolute -bottom-10 -right-10 opacity-30 animate-pulse">
                                <MarathaSword className="w-40 h-40 rotate-[15deg] drop-shadow-lg filter" />
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-black/10 hover:bg-black/20 rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95 group/btn"
                        >
                            <X size={24} className="text-white group-hover/btn:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 pb-8 flex flex-col items-center gap-6 overflow-y-auto bg-gradient-to-b from-white via-orange-50/20 to-white relative">

                    {/* WEBSITE INFO SECTION */}
                    {/* Simple Title Above QR */}
                    <div className="w-full text-center mb-2 z-10 relative">
                        <h3 className={`text-3xl font-black bg-gradient-to-r from-yellow-600 via-white to-yellow-600 bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] text-transparent bg-clip-text tracking-tight uppercase drop-shadow-md ${lang === Language.MR ? 'font-marathi' : ''}`}>
                            {lang === Language.MR ? 'द ग्रेट मराठा' : 'The Great Maratha'}
                        </h3>
                    </div>


                    {/* QR Card with "Divine Aura" */}
                    <div className="group relative animate-in zoom-in-50 duration-700 delay-200">
                        {/* Rotating Golden Aura */}
                        <div className="absolute -inset-[3px] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] animate-[spin_4s_linear_infinite] rounded-[2.2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-tr from-saffron-400 via-amber-300 to-saffron-500 rounded-[2.2rem] blur-md opacity-70"></div>
                        </div>

                        {/* Static Subtle Glow */}
                        <div className="absolute -inset-4 bg-saffron-200/50 rounded-full blur-2xl group-hover:bg-saffron-400/30 transition-colors duration-500"></div>

                        <div className="bg-white p-4 rounded-[2rem] shadow-2xl relative max-w-[240px] mx-auto overflow-hidden border border-gray-100 z-10">
                            <QRCode
                                value={currentUrl}
                                size={180}
                                level="H"
                                fgColor="#7c2d12"
                                bgColor="#ffffff"
                            />
                            {/* Corner Accents */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-saffron-400 rounded-tl-lg"></div>
                            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-saffron-400 rounded-tr-lg"></div>
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-saffron-400 rounded-bl-lg"></div>
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-saffron-400 rounded-br-lg"></div>
                        </div>

                        {/* Scan Tag */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-saffron-600 to-amber-600 px-4 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 whitespace-nowrap z-20 hover:scale-110 transition-transform cursor-default">
                            <ScanLine size={12} className="text-white" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">Scan It</span>
                        </div>
                    </div>

                    {/* Copy Link Action - Glass & Gold */}
                    <div className="w-full relative group animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        <div className="relative flex items-center bg-gray-50/80 rounded-2xl border border-gray-200 p-1.5 overflow-hidden focus-within:ring-2 focus-within:ring-saffron-200 transition-all">
                            <input
                                type="text"
                                readOnly
                                value={currentUrl}
                                className="flex-1 pl-4 pr-3 py-2 bg-transparent text-gray-500 text-xs font-mono focus:outline-none"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="relative px-5 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-bold text-sm flex items-center gap-2 overflow-hidden group/copy"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-saffron-500 to-amber-500 opacity-0 group-hover/copy:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    <Copy size={16} />
                                    {lang === Language.MR ? 'कॉपी' : 'Copy'}
                                </span>
                            </button>
                        </div>
                    </div>


                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                    {/* Developer Name Above QR - Metallic Gold */}
                    <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-4 duration-700 delay-200 z-10 relative text-center w-full">
                        <div className="flex items-center gap-2 mb-1 opacity-60">
                            <div className="h-px w-6 bg-gradient-to-r from-transparent to-saffron-400"></div>
                            <span className="text-[8px] uppercase tracking-[0.3em] text-saffron-800 font-bold">Website Developed By</span>
                            <div className="h-px w-6 bg-gradient-to-l from-transparent to-saffron-400"></div>
                        </div>
                        {/* Crossed Swords Decoration */}
                        <div className="flex justify-center gap-4 mb-3 opacity-40">
                            <MarathaSword className="w-8 h-8 rotate-45" />
                            <MarathaSword className="w-8 h-8 -rotate-45" />
                        </div>
                        {/* Metallic Gold Text Effect */}
                        <h3 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-saffron-600 to-amber-700 drop-shadow-sm pb-1">
                            Vedant Dhawane
                        </h3>

                        {/* Developer Contact */}
                        <div className="mt-2 flex items-center justify-center gap-3 w-full">
                            <a href="mailto:vedantvlogs21@gmail.com" className="group p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-saffron-200 transition-all active:scale-95" title="Email Me">
                                <Mail size={14} className="text-gray-500 group-hover:text-saffron-600 transition-colors" />
                            </a>
                            <a href="https://instagram.com/developer_vedant" target="_blank" rel="noopener noreferrer" className="group p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-pink-200 transition-all active:scale-95" title="Instagram">
                                <Instagram size={14} className="text-gray-500 group-hover:text-pink-600 transition-colors" />
                            </a>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">Need a website or app? Contact me!</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShareQRModal;
