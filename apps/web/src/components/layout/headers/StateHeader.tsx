'use client';

import React from 'react';
import Link from 'next/link';
import type { AuthUser } from '../../../services/auth.service';

interface RoleHeaderProps {
  user: AuthUser;
  pathname: string;
  language: 'en' | 'hi';
  onSetLanguage: (lang: 'en' | 'hi') => void;
  onLogout: () => void;
}

export default function StateHeader({
  user,
  pathname,
  language,
  onSetLanguage,
  onLogout,
}: RoleHeaderProps) {
  const navLinks = [
    { name: '🏛️ State Oversight', href: '/dashboard/state' },
    { name: 'State Projects Pipeline', href: '/projects' },
    { name: 'Requiring Bodies', href: '/organizations' },
    { name: 'District Corridors', href: '/gis/projects' },
    { name: 'Interactive GIS', href: '/gis' },
    { name: 'Clearances & Stage-Gates', href: '/workflow/pending' },
    { name: 'State Escrow & DBT', href: '/compensation' },
    { name: 'Vidhan Sabha MIS', href: '/reports' },
    { name: 'Audit Logs', href: '/audit' },
  ];

  return (
    <header className="w-full bg-white font-sans sticky top-0 z-50 shadow-sm">
      {/* Main Identity Row */}
      <div className="max-w-[1700px] mx-auto px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* State Government Identity */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/state" className="flex items-center gap-4 group">
            <img
              src="/Ministry_of_Rural_Development.png"
              alt="Ministry of Rural Development"
              className="h-14 md:h-16 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col pl-4 border-l border-[#DDD8C8]">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-2xl md:text-3xl tracking-tight text-[#122C4A] leading-none">
                  VASUNDHARA
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded uppercase tracking-wider">
                  State Headquarters
                </span>
              </div>
              <span className="text-xs md:text-sm text-[#5B6472] font-medium mt-1">
                National Land Acquisition &amp; Management System
              </span>
            </div>
          </Link>
        </div>

        {/* Right Tools & User Profile */}
        <div className="flex items-center flex-wrap gap-3">
          {/* State Metric Indicator */}
          <div className="hidden xl:flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-[11px] text-amber-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            52 Districts Synchronized
          </div>

          {/* Primary Quick Action */}
          <Link
            href="/dashboard/state"
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            🏛️ State Command
          </Link>

          {/* GIS Link */}
          <Link
            href="/gis"
            className="bg-blue-50 text-[#1D5FA8] hover:bg-blue-100 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
          >
            🗺️ State GIS
          </Link>

          {/* Language Selector */}
          <div className="flex items-center text-xs font-semibold rounded-lg overflow-hidden bg-[#122C4A] text-white">
            <button
              type="button"
              onClick={() => onSetLanguage('en')}
              className={`px-3 py-1.5 transition ${
                language === 'en' ? 'bg-[#0E243D] text-white font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-gray-500">|</span>
            <button
              type="button"
              onClick={() => onSetLanguage('hi')}
              className={`px-3 py-1.5 transition ${
                language === 'hi' ? 'bg-[#0E243D] text-white font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              HI
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#DDD8C8]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#0F263E] text-amber-400 font-bold text-xs flex items-center justify-center ring-1 ring-amber-400">
                {user.name ? user.name[0].toUpperCase() : 'S'}
              </span>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#122C4A] leading-tight">{user.name}</span>
                <span className="text-[10px] text-amber-700 font-semibold">State Secretary / Officer</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-xs font-bold text-red-600 hover:text-white px-2.5 py-1 border border-red-200 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
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
                    className={`block px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-[#0E243D] font-bold text-white shadow-sm border-b-2 border-[#F59E0B]'
                        : 'text-gray-200 hover:bg-[#0E243D] hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:flex items-center gap-3 pl-4 py-1 text-xs text-amber-300">
            <span className="text-[11px] font-mono">MP Revenue Gateway</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
