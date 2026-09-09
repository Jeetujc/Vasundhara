import Link from 'next/link';

export default function Header() {
  return (
    <div className="bg-[#FBFAF6] text-[#1B2430] font-sans">
      {/* Top identity bar */}
      <div className="flex flex-wrap items-center justify-between px-8 py-3.5 border-b-[3px] border-[#122C4A] bg-white gap-4">
        <div className="flex items-center gap-4">
          <div className="w-[46px] h-[46px] shrink-0" aria-label="Emblem of India">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#122C4A" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#122C4A" strokeWidth="1.5" />
              <g stroke="#122C4A" strokeWidth="1.3">
                <line x1="50" y1="20" x2="50" y2="80" />
                <line x1="20" y1="50" x2="80" y2="50" />
                <line x1="28.8" y1="28.8" x2="71.2" y2="71.2" />
                <line x1="28.8" y1="71.2" x2="71.2" y2="28.8" />
                <line x1="50" y1="20" x2="61" y2="39" />
                <line x1="50" y1="20" x2="39" y2="39" />
                <line x1="50" y1="80" x2="61" y2="61" />
                <line x1="50" y1="80" x2="39" y2="61" />
                <line x1="20" y1="50" x2="39" y2="61" />
                <line x1="20" y1="50" x2="39" y2="39" />
                <line x1="80" y1="50" x2="61" y2="61" />
                <line x1="80" y1="50" x2="61" y2="39" />
              </g>
              <circle cx="50" cy="50" r="4" fill="#122C4A" />
            </svg>
          </div>
          <div className="text-[11px] leading-[1.45] text-[#5B6472] font-semibold">
            <span className="text-[12px] text-[#1B2430]">भारत सरकार</span><br />
            <span className="text-[14px] tracking-[0.01em] text-[#122C4A] font-bold">MINISTRY OF RURAL<br />DEVELOPMENT</span><br />
            <span className="font-normal text-[#5B6472]">GOVERNMENT OF INDIA</span>
          </div>
          <div className="flex flex-col pl-5 border-l border-[#DDD8C8]">
            <span className="font-serif font-bold text-[26px] md:text-[34px] text-[#122C4A] tracking-[0.01em] leading-none">
              VASUNDHARA
            </span>
            <span className="text-[14px] text-[#5B6472] mt-1 hidden sm:block">
              National Land Acquisition &amp; Management System
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-[#122C4A] border border-[#DDD8C8] rounded-full px-3 py-1 bg-[#FDF8E3]">
            EN | HI
          </span>
         
        </div>
      </div>
    </div>
  );
}