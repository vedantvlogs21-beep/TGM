import React, { useEffect, useState, useRef } from 'react';
import { Translation, Language } from '../types';
import { Users, Calendar, Award } from 'lucide-react';

interface StatsBannerProps {
  t: Translation;
  lang: Language;
  totalMembers?: number;
}

// Sub-component for counting animation
const Counter: React.FC<{ end: number, suffix?: string }> = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !hasStarted) {
        setHasStarted(true);
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    // If end is 0, just show 0
    if (end === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    // duration based on the number size, but max 2 seconds
    const duration = 2000;
    const incrementTime = duration / end;

    // For larger numbers, increment by more than 1 to keep it fast
    const step = end > 100 ? Math.ceil(end / 100) : 1;

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, end > 100 ? 20 : incrementTime);

    return () => clearInterval(timer);
  }, [hasStarted, end]);

  return <span ref={ref} className="text-4xl md:text-5xl font-black tracking-tight">{count}{suffix}</span>;
};

const StatsBanner: React.FC<StatsBannerProps> = ({ t, lang, totalMembers = 2000 }) => {
  return (
    <section className="relative bg-gradient-to-r from-saffron-600 to-saffron-800 text-white pt-16 pb-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor"></circle>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">

        {/* Slogan */}
        <div className="text-center lg:text-left transform transition-all hover:scale-105 duration-300">
          <h2 className={`text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md leading-tight ${lang === Language.MR ? 'font-marathi' : 'font-sans italic'}`}>
            "{t.slogan}"
          </h2>
          <div className="h-2 w-32 bg-white/30 rounded-full mx-auto lg:mx-0"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-8 md:gap-16 w-full lg:w-auto">
          <div className="flex flex-col items-center text-center group">
            <div className="bg-white/20 p-4 rounded-2xl mb-3 backdrop-blur-sm transition-transform duration-300 group-hover:rotate-6 group-hover:bg-white/30 group-hover:scale-110 shadow-lg">
              <Users size={32} className="text-white" />
            </div>
            <Counter end={Math.max(2000, totalMembers)} suffix="+" />
            <span className={`text-xs md:text-sm uppercase tracking-widest font-bold opacity-80 mt-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>
              {t.stats_members}
            </span>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="bg-white/20 p-4 rounded-2xl mb-3 backdrop-blur-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:bg-white/30 group-hover:scale-110 shadow-lg">
              <Award size={32} className="text-white" />
            </div>
            <Counter end={3} suffix="+" />
            <span className={`text-xs md:text-sm uppercase tracking-widest font-bold opacity-80 mt-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>
              {t.stats_years}
            </span>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="bg-white/20 p-4 rounded-2xl mb-3 backdrop-blur-sm transition-transform duration-300 group-hover:rotate-6 group-hover:bg-white/30 group-hover:scale-110 shadow-lg">
              <Calendar size={32} className="text-white" />
            </div>
            <Counter end={100} suffix="+" />
            <span className={`text-xs md:text-sm uppercase tracking-widest font-bold opacity-80 mt-1 ${lang === Language.MR ? 'font-marathi' : ''}`}>
              {t.stats_events}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg className="w-full h-12 md:h-16 text-white fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default StatsBanner;