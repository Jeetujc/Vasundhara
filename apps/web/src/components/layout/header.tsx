'use client';

import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="bg-[#FBFAF6] text-[#1B2430] font-sans">
      {/* Top identity bar */}
      <div className="flex flex-wrap items-center justify-between px-8 py-3.5 border-b-[3px] border-[#122C4A] bg-white gap-4">
        
        {/* LEFT ALIGNED GROUP */}
        <div className="flex items-center gap-4">
          
          {/* 1. MINISTRY LOGO (Now strictly on the left) */}
          <Link href="/" className="text-[11px] leading-[1.45] text-[#5B6472] font-semibold">
            <img 
              src="/Ministry_of_Rural_Development.png" 
              alt="Ministry of Rural Development" 
              className="h-16 md:h-20 w-auto object-contain" 
            />
          </Link>
          
          {/* 2. VASUNDHARA TEXT */}
          <div className="flex flex-col pl-5 border-l border-[#DDD8C8]">
            <Link href="/" className="font-serif font-bold text-[26px] md:text-[34px] text-[#122C4A] tracking-[0.01em] leading-none hover:opacity-90">
              VASUNDHARA
            </Link>
            <span className="text-[14px] text-[#5B6472] mt-1 hidden sm:block">
              {t('app.subtitle', 'National Land Acquisition & Management System')}
            </span>
          </div>
          
        </div>
        
        {/* RIGHT ALIGNED GROUP */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-[12px] font-semibold border border-[#DDD8C8] rounded-full overflow-hidden bg-[#FDF8E3]">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 transition-colors ${language === 'en' ? 'bg-[#122C4A] text-white font-bold' : 'text-[#122C4A] hover:bg-[#eae3cb]'}`}
            >
              EN
            </button>
            <span className="text-[#DDD8C8]">|</span>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 transition-colors ${language === 'hi' ? 'bg-[#122C4A] text-white font-bold' : 'text-[#122C4A] hover:bg-[#eae3cb]'}`}
            >
              HI
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}