import Link from 'next/link';

export default function Header() {
  return (
    <div className="bg-[#FBFAF6] text-[#1B2430] font-sans">
      {/* Top identity bar */}
      <div className="flex flex-wrap items-center justify-between px-8 py-3.5 border-b-[3px] border-[#122C4A] bg-white gap-4">
        
        {/* LEFT ALIGNED GROUP */}
        <div className="flex items-center gap-4">
          
          {/* 1. MINISTRY LOGO (Now strictly on the left) */}
          <div className="text-[11px] leading-[1.45] text-[#5B6472] font-semibold">
            <img 
              src="/Ministry_of_Rural_Development.png" 
              alt="Ministry of Rural Development" 
              className="h-16 md:h-20 w-auto object-contain" 
            />
          </div>
          
          {/* 2. VASUNDHARA TEXT */}
          <div className="flex flex-col pl-5 border-l border-[#DDD8C8]">
            <span className="font-serif font-bold text-[26px] md:text-[34px] text-[#122C4A] tracking-[0.01em] leading-none">
              VASUNDHARA
            </span>
            <span className="text-[14px] text-[#5B6472] mt-1 hidden sm:block">
              National Land Acquisition &amp; Management System
            </span>
          </div>
          
        </div>
        
        {/* RIGHT ALIGNED GROUP */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-[#122C4A] border border-[#DDD8C8] rounded-full px-3 py-1 bg-[#FDF8E3]">
            EN | HI
          </span>
        </div>
        
      </div>
    </div>
  );
}