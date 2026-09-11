'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Page() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FBFAF6] text-[#1B2430] font-sans">
      {/* Top identity bar matching reference image */}
      <div className="flex flex-wrap items-center justify-between px-6 lg:px-8 py-3 bg-white shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/Ministry_of_Rural_Development.png"
            alt="Ministry of Rural Development, Government of India"
            className="h-14 md:h-16 w-auto object-contain shrink-0"
          />

          <div className="flex flex-col pl-4 border-l border-[#DDD8C8]">
            <span className="font-serif font-bold text-2xl md:text-3xl text-[#122C4A] tracking-tight leading-none">
              VASUNDHARA
            </span>
            <span className="text-xs md:text-sm text-[#5B6472] font-medium mt-1">
              {t('app.subtitle', 'National Land Acquisition & Management System')}
            </span>
          </div>
        </div>

        {/* Right Tools: Language Pill + Amber Login Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-xs font-semibold rounded-lg overflow-hidden bg-[#122C4A] text-white">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 transition ${
                language === 'en'
                  ? 'bg-[#0E243D] text-white font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-gray-500">|</span>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 transition ${
                language === 'hi'
                  ? 'bg-[#0E243D] text-white font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              HI
            </button>
          </div>

          <Link href="/login/mainlogin">
            <button className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-sm px-6 py-2 rounded-lg transition shadow-sm">
              {t('nav.login', 'Login')}
            </button>
          </Link>
        </div>
      </div>

      {/* Nav matching reference image */}
      <nav className="bg-[#122C4A] text-white px-6 lg:px-8 py-0 shadow-inner">
        <ul className="flex flex-wrap items-center list-none m-0 p-0 text-[13px] font-semibold tracking-wide">
          {[
            { name: t('nav.home', 'Home'), href: '/' },
            { name: t('nav.about', 'About Us'), href: '/#about-us' },
            { name: t('nav.notifications', 'Notifications'), href: '/notifications' },
            {
              name: t('nav.act', 'Act'),
              href: 'https://mwcc.org.in/knowledge%20center/LandAcqisition/landAcquisitionAct-2013-.pdf',
              newTab: true,
            },
            { name: t('nav.projects', 'Projects'), href: '/#projects' },
            { name: t('nav.links', 'Important Links'), href: '/#important-links' },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                className="block px-5 py-3 text-[#EAF0F7] hover:bg-[#0E243D] hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main layout */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-8 pt-7 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-7 items-start">
          {/* WHAT'S NEW Sidebar Card */}
          <aside className="bg-[#FDF8E3] border border-[#E7DFB8] rounded-lg py-5 px-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#122C4A] pb-2 border-b-2 border-[#F2A71B]">
              WHAT'S NEW
            </h3>
            <ul className="flex flex-col gap-3 mt-3.5 list-none p-0">
              <li className="text-xs leading-relaxed text-[#5B6472] pb-3 border-b border-dashed border-[#DDD8C8]">
                <span className="block text-[11px] font-bold text-[#B96E22] mb-0.5">02 SEP 2026</span>
                Revised compensation rates notified for 6 districts.
              </li>
              <li className="text-xs leading-relaxed text-[#5B6472] pb-3 border-b border-dashed border-[#DDD8C8]">
                <span className="block text-[11px] font-bold text-[#B96E22] mb-0.5">27 AUG 2026</span>
                Online grievance tracking now live for all divisions.
              </li>
              <li className="text-xs leading-relaxed text-[#5B6472] pb-3 border-b border-dashed border-[#DDD8C8]">
                <span className="block text-[11px] font-bold text-[#B96E22] mb-0.5">14 AUG 2026</span>
                Public hearing schedule published for Q3 acquisitions.
              </li>
              <li className="text-xs leading-relaxed text-[#5B6472]">
                <span className="block text-[11px] font-bold text-[#B96E22] mb-0.5">05 AUG 2026</span>
                Draft award list uploaded for review and objections.
              </li>
            </ul>
          </aside>

          {/* Right Main Grid Area */}
          <div className="flex flex-col gap-8">
            {/* 4 Stat Metric Cards (Matching reference image) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#DDD8C8] border-t-4 border-t-[#1D5FA8] rounded-lg py-5 px-4 text-center shadow-sm hover:shadow-md transition">
                <strong className="block font-serif text-2xl md:text-3xl text-[#122C4A] mb-1">
                  18,420 ha
                </strong>
                <span className="text-xs font-semibold text-[#5B6472]">Total Land Notified</span>
              </div>
              <div className="bg-white border border-[#DDD8C8] border-t-4 border-t-[#1D5FA8] rounded-lg py-5 px-4 text-center shadow-sm hover:shadow-md transition">
                <strong className="block font-serif text-2xl md:text-3xl text-[#122C4A] mb-1">
                  12,860 ha
                </strong>
                <span className="text-xs font-semibold text-[#5B6472]">Total Land Acquired</span>
              </div>
              <div className="bg-white border border-[#DDD8C8] border-t-4 border-t-[#1D5FA8] rounded-lg py-5 px-4 text-center shadow-sm hover:shadow-md transition">
                <strong className="block font-serif text-2xl md:text-3xl text-[#122C4A] mb-1">
                  ₹2,340 Cr
                </strong>
                <span className="text-xs font-semibold text-[#5B6472]">Compensation Disbursed</span>
              </div>
              <div className="bg-white border border-[#DDD8C8] border-t-4 border-t-[#1D5FA8] rounded-lg py-5 px-4 text-center shadow-sm hover:shadow-md transition">
                <strong className="block font-serif text-2xl md:text-3xl text-[#122C4A] mb-1">
                  9,175
                </strong>
                <span className="text-xs font-semibold text-[#5B6472]">Families Resettled</span>
              </div>
            </div>

            {/* Projects Section (Matching reference image) */}
            <section id="projects">
              <h2 className="font-serif text-2xl text-[#122C4A] font-bold mb-1">Projects</h2>
              <div className="w-14 h-[3px] bg-[#F2A71B] mb-5"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-[#DDD8C8] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <div className="h-28 flex items-center justify-center text-white text-xs font-bold text-center p-3 bg-gradient-to-br from-[#1D5FA8] to-[#122C4A]">
                    Bridge &amp; Flyover Works
                  </div>
                  <p className="p-3 text-xs font-semibold text-[#1B2430]">
                    Nagpur–Katol Elevated Corridor
                  </p>
                </div>
                <div className="border border-[#DDD8C8] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <div className="h-28 flex items-center justify-center text-white text-xs font-bold text-center p-3 bg-gradient-to-br from-[#B96E22] to-[#7B4A15]">
                    Highway Widening
                  </div>
                  <p className="p-3 text-xs font-semibold text-[#1B2430]">
                    NH-44 Land Parcel Handover
                  </p>
                </div>
                <div className="border border-[#DDD8C8] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <div className="h-28 flex items-center justify-center text-white text-xs font-bold text-center p-3 bg-gradient-to-br from-[#2E5629] to-[#1B3B18]">
                    Rail Corridor
                  </div>
                  <p className="p-3 text-xs font-semibold text-[#1B2430]">
                    Dedicated Freight Corridor, Phase II
                  </p>
                </div>
                <div className="border border-[#DDD8C8] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <div className="h-28 flex items-center justify-center text-white text-xs font-bold text-center p-3 bg-gradient-to-br from-[#3A4D59] to-[#22313B]">
                    Rural Access Roads
                  </div>
                  <p className="p-3 text-xs font-semibold text-[#1B2430]">
                    PMGSY Connectivity Package 14
                  </p>
                </div>
              </div>
            </section>

            {/* About Us Section (Matching reference image) */}
            <section id="about-us">
              <h2 className="font-serif text-2xl text-[#122C4A] font-bold mb-1">About Us</h2>
              <div className="w-14 h-[3px] bg-[#F2A71B] mb-5"></div>
              <div className="text-sm leading-relaxed text-[#5B6472] max-w-4xl space-y-3">
                <p>
                  <strong className="text-[#1B2430]">VASUNDHARA</strong> is the national digital platform of the Ministry of Rural Development for managing land acquisition, compensation, and resettlement records across the country. It brings notifications, award orders, grievance tracking, and project-wise land status onto a single portal for citizens, revenue officers, and district administrators.
                </p>
                <p>
                  The system is part of the wider Digital Land Records Modernisation Programme and is designed to make every stage of the acquisition process — from notification to final award — transparent and traceable under the RFCTLARR Act, 2013.
                </p>
              </div>
            </section>

            {/* Important Links Section */}
            <section id="important-links">
              <h2 className="font-serif text-2xl text-[#122C4A] font-bold mb-1">Important Links</h2>
              <div className="w-14 h-[3px] bg-[#F2A71B] mb-5"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-[#F3F1EA] rounded-lg p-6 text-center flex flex-col items-center justify-center hover:bg-[#eceae2] transition shadow-sm">
                  <h4 className="font-serif text-base font-bold text-[#1B2430] mb-2">
                    LA Target Monitoring
                  </h4>
                  <p className="text-xs text-[#5B6472] mb-4">
                    Ministry of Rural Development<br />(Land Acquisition Wing)
                  </p>
                  <Link
                    href="/projects"
                    className="text-xs font-bold text-[#B96E22] hover:underline"
                  >
                    View Status →
                  </Link>
                </div>

                <div className="bg-[#122C4A] text-white rounded-lg p-6 text-center flex flex-col items-center justify-center hover:bg-[#0E243D] transition shadow-sm">
                  <h4 className="font-serif text-base font-bold text-white mb-2">
                    Public Grievances
                  </h4>
                  <p className="text-xs text-gray-300 mb-4">
                    Ministry of Rural Development<br />(Citizen Redressal Cell)
                  </p>
                  <Link
                    href="/grivence/citizen"
                    className="text-xs font-bold bg-[#F59E0B] text-white px-4 py-1.5 rounded hover:bg-[#D97706] transition"
                  >
                    Lodge Grievance →
                  </Link>
                </div>

                <div className="bg-[#F3F1EA] rounded-lg p-6 text-center flex flex-col items-center justify-center hover:bg-[#eceae2] transition shadow-sm">
                  <h4 className="font-serif text-base font-bold text-[#1B2430] mb-2">
                    RFCTLARR Act, 2013
                  </h4>
                  <p className="text-xs text-[#5B6472] mb-4">
                    Statutory Framework &amp; Legal Gazette
                  </p>
                  <a
                    href="https://mwcc.org.in/knowledge%20center/LandAcqisition/landAcquisitionAct-2013-.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#B96E22] hover:underline"
                  >
                    Read Act PDF →
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0E243D] text-[#9FB0C4] text-xs text-center py-6 px-4 border-t border-[#1D5FA8]/30">
        © Ministry of Rural Development, Government of India — VASUNDHARA National Land Acquisition &amp; Management System
      </footer>
    </div>
  );
}