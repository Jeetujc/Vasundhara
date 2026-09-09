import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FBFAF6] text-[#1B2430] font-sans">
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
          <button className="text-[12px] font-bold px-4 py-[9px] rounded bg-[#F2A71B] text-white tracking-[0.02em] hover:opacity-90">
            Official Login
          </button>
          <button className="text-[12px] font-bold px-4 py-[9px] rounded bg-[#1D5FA8] text-white tracking-[0.02em] hover:opacity-90">
            Citizen Login
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-[#122C4A] flex flex-wrap items-center px-8 py-2 md:py-0">
        <ul className="flex flex-wrap flex-1 list-none m-0 p-0">
          {['Home', 'About Us', 'Notification', 'Act', 'Projects', 'Important Links'].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="block px-[18px] py-[14px] text-[#EAF0F7] text-[13px] font-semibold tracking-[0.02em] hover:bg-[#0B1F35] transition-colors">
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center bg-white rounded-[3px] overflow-hidden my-2">
          <input type="text" placeholder="Search..." className="border-none px-2.5 py-2 text-[13px] w-[220px] outline-none" />
          <button type="button" className="bg-[#F2A71B] text-[#0B1F35] px-3 py-2 text-[13px] font-medium hover:opacity-90">
            Search
          </button>
        </div>
        <a href="#contact" className="text-[#EAF0F7] text-[12px] font-bold pl-[22px] tracking-[0.02em] hover:text-[#F2A71B]">
          CONTACT US
        </a>
      </nav>

      {/* Main layout */}
      <main className="max-w-[1280px] mx-auto px-8 pt-7 pb-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-[26px]">
          
          <aside className="bg-[#FDF8E3] border border-[#E7DFB8] rounded py-4 px-4 h-fit">
            <h3 className="text-[13px] font-bold m-0 mb-3 pb-2 border-b-2 border-[#F2A71B] text-[#122C4A]">WHAT'S NEW</h3>
            <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
              <li className="text-[12px] leading-relaxed text-[#5B6472] pb-2.5 border-b border-dashed border-[#DDD8C8]">
                <span className="block text-[10px] font-bold text-[#B96E22] mb-0.5">02 SEP 2026</span>
                Revised compensation rates notified for 6 districts.
              </li>
              <li className="text-[12px] leading-relaxed text-[#5B6472] pb-2.5 border-b border-dashed border-[#DDD8C8]">
                <span className="block text-[10px] font-bold text-[#B96E22] mb-0.5">27 AUG 2026</span>
                Online grievance tracking now live for all divisions.
              </li>
              <li className="text-[12px] leading-relaxed text-[#5B6472] pb-2.5 border-b border-dashed border-[#DDD8C8]">
                <span className="block text-[10px] font-bold text-[#B96E22] mb-0.5">14 AUG 2026</span>
                Public hearing schedule published for Q3 acquisitions.
              </li>
              <li className="text-[12px] leading-relaxed text-[#5B6472]">
                <span className="block text-[10px] font-bold text-[#B96E22] mb-0.5">05 AUG 2026</span>
                Draft award list uploaded for review and objections.
              </li>
            </ul>
          </aside>

          <div className="flex flex-col gap-[34px]">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#DDD8C8] border-t-[3px] border-t-[#1D5FA8] rounded-[3px] py-4 px-3.5 text-center shadow-sm">
                <strong className="block font-serif text-[24px] text-[#122C4A] mb-1.5">18,420 ha</strong>
                <span className="text-[12px] font-semibold text-[#5B6472] leading-[1.4]">Total Land Notified</span>
              </div>
              <div className="bg-white border border-[#DDD8C8] border-t-[3px] border-t-[#1D5FA8] rounded-[3px] py-4 px-3.5 text-center shadow-sm">
                <strong className="block font-serif text-[24px] text-[#122C4A] mb-1.5">12,860 ha</strong>
                <span className="text-[12px] font-semibold text-[#5B6472] leading-[1.4]">Total Land Acquired</span>
              </div>
              <div className="bg-white border border-[#DDD8C8] border-t-[3px] border-t-[#1D5FA8] rounded-[3px] py-4 px-3.5 text-center shadow-sm">
                <strong className="block font-serif text-[24px] text-[#122C4A] mb-1.5">₹2,340 Cr</strong>
                <span className="text-[12px] font-semibold text-[#5B6472] leading-[1.4]">Compensation Disbursed</span>
              </div>
              <div className="bg-white border border-[#DDD8C8] border-t-[3px] border-t-[#1D5FA8] rounded-[3px] py-4 px-3.5 text-center shadow-sm">
                <strong className="block font-serif text-[24px] text-[#122C4A] mb-1.5">9,175</strong>
                <span className="text-[12px] font-semibold text-[#5B6472] leading-[1.4]">Families Resettled</span>
              </div>
            </div>

            <section id="projects">
              <h2 className="font-serif text-[22px] text-[#122C4A] m-0 mb-1">Projects</h2>
              <div className="w-[56px] h-[3px] bg-[#F2A71B] mb-[18px]"></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-[#DDD8C8] rounded-[3px] overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <div className="h-[120px] flex items-center justify-center text-white text-[12px] font-semibold text-center p-2.5 bg-gradient-to-br from-[#1D5FA8] to-[#122C4A]">Bridge &amp; Flyover Works</div>
                  <p className="m-0 py-2.5 px-3 text-[12px] font-semibold text-[#1B2430]">Nagpur–Katol Elevated Corridor</p>
                </div>
                <div className="border border-[#DDD8C8] rounded-[3px] overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <div className="h-[120px] flex items-center justify-center text-white text-[12px] font-semibold text-center p-2.5 bg-gradient-to-br from-[#B96E22] to-[#5B3712]">Highway Widening</div>
                  <p className="m-0 py-2.5 px-3 text-[12px] font-semibold text-[#1B2430]">NH-44 Land Parcel Handover</p>
                </div>
                <div className="border border-[#DDD8C8] rounded-[3px] overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <div className="h-[120px] flex items-center justify-center text-white text-[12px] font-semibold text-center p-2.5 bg-gradient-to-br from-[#33512E] to-[#122C1A]">Rail Corridor</div>
                  <p className="m-0 py-2.5 px-3 text-[12px] font-semibold text-[#1B2430]">Dedicated Freight Corridor, Phase II</p>
                </div>
                <div className="border border-[#DDD8C8] rounded-[3px] overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <div className="h-[120px] flex items-center justify-center text-white text-[12px] font-semibold text-center p-2.5 bg-gradient-to-br from-[#4A5D6B] to-[#12222C]">Rural Access Roads</div>
                  <p className="m-0 py-2.5 px-3 text-[12px] font-semibold text-[#1B2430]">PMGSY Connectivity Package 14</p>
                </div>
              </div>
            </section>

            <section id="about">
              <h2 className="font-serif text-[22px] text-[#122C4A] m-0 mb-1">About Us</h2>
              <div className="w-[56px] h-[3px] bg-[#F2A71B] mb-[18px]"></div>
              <div className="text-[14px] leading-[1.75] text-[#5B6472] max-w-[820px] space-y-4">
                <p><strong className="text-[#1B2430]">VASUNDHARA</strong> is the national digital platform of the Ministry of Rural Development for managing land acquisition, compensation, and resettlement records across the country. It brings notifications, award orders, grievance tracking, and project-wise land status onto a single portal for citizens, revenue officers, and district administrators.</p>
                <p>The system is part of the wider Digital Land Records Modernisation Programme and is designed to make every stage of the acquisition process — from notification to final award — transparent and traceable.</p>
              </div>
            </section>

            <section id="important-links">
              <h2 className="font-serif text-[22px] text-[#122C4A] m-0 mb-1">Important Links</h2>
              <div className="w-[56px] h-[3px] bg-[#F2A71B] mb-[18px]"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                
                <div className="bg-[#F3F1EA] rounded-[4px] py-[34px] px-6 text-center relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center hover:bg-[#eceae2] transition">
                  <div className="w-[56px] h-[56px] mb-4">
                    <svg viewBox="0 0 48 48" className="w-full h-full stroke-[#B96E22] fill-transparent stroke-[1.4px]">
                      <path d="M8 34 L26 16 L32 22 L14 40 L6 42 Z"/><path d="M23 19 L29 25"/><path d="M6 42 L8 34"/><path d="M28 12 L36 4 L44 12 L36 20 Z"/>
                    </svg>
                  </div>
                  <h4 className="font-serif text-[19px] text-[#1B2430] m-0 mb-3">LA Target Monitoring</h4>
                  <p className="text-[13px] text-[#5B6472] leading-[1.5] m-0 mb-[18px]">Ministry of Rural Development<br/>(Land Acquisition Wing)</p>
                  <a href="#" className="w-[38px] h-[38px] rounded-full bg-white border border-[#DDD8C8] flex items-center justify-center text-[18px] text-[#B96E22] font-semibold hover:bg-gray-50 transition" aria-label="Open LA Target Monitoring">+</a>
                </div>

                <div 
                  className="rounded-[4px] py-[34px] px-6 text-center relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center text-white"
                  style={{ backgroundImage: "linear-gradient(rgba(10,20,32,0.35), rgba(10,20,32,0.72)), url('https://images.unsplash.com/photo-1508260418124-01161d1cea2d?auto=format&fit=crop&w=800&q=60')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="w-[56px] h-[56px] mb-4">
                    <svg viewBox="0 0 48 48" className="w-full h-full stroke-white fill-transparent stroke-[1.4px]">
                      <rect x="10" y="16" width="28" height="20" rx="1"/><path d="M10 24 L38 24 M18 16 L18 36 M30 16 L30 36"/><circle cx="18" cy="30" r="2"/><circle cx="30" cy="30" r="2"/>
                    </svg>
                  </div>
                  <h4 className="font-serif text-[19px] text-white m-0 mb-3">Public Grievances</h4>
                  <p className="text-[13px] text-[#EAEAEA] leading-[1.5] m-0 mb-[18px]">Ministry of Rural Development<br/>(Land Acquisition Wing)</p>
                  <a href="#" className="inline-flex items-center gap-2 bg-white text-[#1B2430] font-bold text-[13px] py-2.5 px-[18px] rounded-[3px] hover:bg-gray-100 transition">+ Read More</a>
                </div>

                <div className="bg-[#F3F1EA] rounded-[4px] py-[34px] px-6 text-center relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center hover:bg-[#eceae2] transition">
                  <div className="w-[56px] h-[56px] mb-4">
                    <svg viewBox="0 0 48 48" className="w-full h-full stroke-[#B96E22] fill-transparent stroke-[1.4px]">
                      <rect x="10" y="8" width="28" height="32" rx="1"/><path d="M16 16 L32 16 M16 22 L32 22 M16 28 L26 28"/><rect x="18" y="32" width="12" height="8"/>
                    </svg>
                  </div>
                  <h4 className="font-serif text-[19px] text-[#1B2430] m-0 mb-3">Act</h4>
                  <p className="text-[13px] text-[#5B6472] leading-[1.5] m-0 mb-[18px]">Ministry of Rural Development<br/>(Land Acquisition Wing)</p>
                  <a href="#" className="w-[38px] h-[38px] rounded-full bg-white border border-[#DDD8C8] flex items-center justify-center text-[18px] text-[#B96E22] font-semibold hover:bg-gray-50 transition" aria-label="Open Act">+</a>
                </div>

                <div className="bg-[#F3F1EA] rounded-[4px] py-[34px] px-6 text-center relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center hover:bg-[#eceae2] transition">
                  <div className="w-[56px] h-[56px] mb-4">
                    <svg viewBox="0 0 48 48" className="w-full h-full stroke-[#B96E22] fill-transparent stroke-[1.4px]">
                      <path d="M14 40 L14 24 L20 24 L20 40 M28 40 L28 30 L34 30 L34 40" /><path d="M10 40 L38 40"/><circle cx="17" cy="18" r="3"/><path d="M17 12 L17 8 M13 10 L11 8 M21 10 L23 8"/>
                    </svg>
                  </div>
                  <h4 className="font-serif text-[19px] text-[#1B2430] m-0 mb-3">Search</h4>
                  <p className="text-[13px] text-[#5B6472] leading-[1.5] m-0 mb-[18px]">Ministry of Rural Development<br/>(Land Acquisition Wing)</p>
                  <a href="#" className="w-[38px] h-[38px] rounded-full bg-white border border-[#DDD8C8] flex items-center justify-center text-[18px] text-[#B96E22] font-semibold hover:bg-gray-50 transition" aria-label="Open Search">+</a>
                </div>

                <div className="bg-[#F3F1EA] rounded-[4px] py-[34px] px-6 text-center relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center hover:bg-[#eceae2] transition">
                  <div className="w-[56px] h-[56px] mb-4">
                    <svg viewBox="0 0 48 48" className="w-full h-full stroke-[#B96E22] fill-transparent stroke-[1.4px]">
                      <path d="M24 8 L38 16 L38 32 L24 40 L10 32 L10 16 Z"/><path d="M18 26 L24 30 L34 20"/>
                    </svg>
                  </div>
                  <h4 className="font-serif text-[19px] text-[#1B2430] m-0 mb-3">FAQs</h4>
                  <p className="text-[13px] text-[#5B6472] leading-[1.5] m-0 mb-[18px]">Ministry of Rural Development<br/>(Land Acquisition Wing)</p>
                  <a href="#" className="w-[38px] h-[38px] rounded-full bg-white border border-[#DDD8C8] flex items-center justify-center text-[18px] text-[#B96E22] font-semibold hover:bg-gray-50 transition" aria-label="Open FAQs">+</a>
                </div>

                <div className="bg-[#F3F1EA] rounded-[4px] py-[34px] px-6 text-center relative overflow-hidden min-h-[220px] flex flex-col items-center justify-center hover:bg-[#eceae2] transition">
                  <div className="w-[56px] h-[56px] mb-4">
                    <svg viewBox="0 0 48 48" className="w-full h-full stroke-[#B96E22] fill-transparent stroke-[1.4px]">
                      <rect x="8" y="26" width="10" height="14"/><rect x="20" y="18" width="10" height="22"/><rect x="32" y="10" width="8" height="30"/>
                    </svg>
                  </div>
                  <h4 className="font-serif text-[19px] text-[#1B2430] m-0 mb-3">Projects</h4>
                  <p className="text-[13px] text-[#5B6472] leading-[1.5] m-0 mb-[18px]">Ministry of Rural Development<br/>(Land Acquisition Wing)</p>
                  <a href="#" className="w-[38px] h-[38px] rounded-full bg-white border border-[#DDD8C8] flex items-center justify-center text-[18px] text-[#B96E22] font-semibold hover:bg-gray-50 transition" aria-label="Open Projects">+</a>
                </div>

              </div>
            </section>

          </div>
        </div>
      </main>

      <footer className="bg-[#0B1F35] text-[#9FB0C4] text-[12px] text-center p-5 mt-10">
        © Ministry of Rural Development, Government of India — VASUNDHARA National Land Acquisition &amp; Management System
      </footer>
    </div>
  );
}