'use client';

import React from 'react';
import Link from 'next/link';

interface GuestHeaderProps {
  pathname: string;
  language: 'en' | 'hi';
  onSetLanguage: (lang: 'en' | 'hi') => void;
}

export default function GuestHeader({
  pathname,
  language,
  onSetLanguage,
}: GuestHeaderProps) {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#about-us' },
    { name: 'Notifications', href: '/notifications' },
    {
      name: 'Act',
      href: 'https://mwcc.org.in/knowledge%20center/LandAcqisition/landAcquisitionAct-2013-.pdf',
      newTab: true,
    },
    { name: 'Projects', href: '/projects' },
    { name: 'Important Links', href: '/#important-links' },
  ];

  return (
    <header className="w-full bg-white font-sans sticky top-0 z-50 shadow-sm">
      {/* Top Identity Row */}
      <div className="max-w-[1700px] mx-auto px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* National Emblem & Department Branding */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4 group">
            <img
              src="/Ministry_of_Rural_Development.png"
              alt="Ministry of Rural Development, Government of India"
              className="h-14 md:h-16 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col pl-4 border-l border-[#DDD8C8]">
              <span className="font-serif font-black text-2xl md:text-3xl tracking-tight text-[#122C4A] leading-none">
                VASUNDHARA
              </span>
              <span className="text-xs md:text-sm text-[#5B6472] font-medium mt-1">
                National Land Acquisition &amp; Management System
              </span>
            </div>
          </Link>
        </div>

        {/* Right Tools: Language Toggle & Login */}
        <div className="flex items-center gap-3">
          {/* Language Toggle Pill */}
          <div className="flex items-center text-xs font-semibold rounded-lg overflow-hidden bg-[#122C4A] text-white">
            <button
              type="button"
              onClick={() => onSetLanguage('en')}
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
              onClick={() => onSetLanguage('hi')}
              className={`px-3 py-1.5 transition ${
                language === 'hi'
                  ? 'bg-[#0E243D] text-white font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              HI
            </button>
          </div>

          {/* Login Button (Solid Amber-Gold as in reference image) */}
          <Link
            href="/login/mainlogin"
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-sm px-6 py-2 rounded-lg transition shadow-sm inline-flex items-center justify-center"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Navigation Bar (Deep Navy as in reference image) */}
      <nav className="bg-[#122C4A] text-white px-6 lg:px-8 py-0 shadow-inner">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between overflow-x-auto">
          <ul className="flex items-center list-none m-0 p-0 text-[13px] font-semibold tracking-wide">
            {navLinks.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    target={item.newTab ? '_blank' : undefined}
                    rel={item.newTab ? 'noopener noreferrer' : undefined}
                    className={`block px-5 py-3 transition-colors ${
                      isActive
                        ? 'bg-[#0E243D] font-bold text-white shadow-sm border-b-2 border-[#F59E0B]'
                        : 'text-[#EAF0F7] hover:bg-[#0E243D] hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:flex items-center gap-2 pl-4 py-1">
            <Link
              href="/gis"
              className="text-xs bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-1.5 rounded transition"
            >
              🗺️ Public GIS Map
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
