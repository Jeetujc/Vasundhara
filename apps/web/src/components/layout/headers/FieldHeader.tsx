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

export default function FieldHeader({
  user,
  pathname,
  language,
  onSetLanguage,
  onLogout,
}: RoleHeaderProps) {
  const navLinks = [
    { name: '⚡ Field Work Center', href: '/dashboard/field', highlightAmber: true },
    { name: 'Assigned Survey Tasks', href: '/workflow/tasks' },
    { name: 'Assigned Parcels', href: '/parcels' },
    { name: 'Cadastral Ground GIS', href: '/gis/parcels' },
    { name: 'Satellite Map', href: '/gis' },
    { name: 'Possession & Panchnama', href: '/possession' },
    { name: 'Spot Documents & Assets', href: '/documents' },
  ];

  return (
    <header className="w-full bg-white font-sans sticky top-0 z-50 shadow-sm">
      {/* Main Identity Row */}
      <div className="max-w-[1700px] mx-auto px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Field Squad Branding */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/field" className="flex items-center gap-4 group">
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
                <span className="text-[10px] font-bold bg-[#B96E22] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                  Field Squad
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
          {/* Tactical Status Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full text-[11px] text-amber-900 font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            GPS Satellite &amp; Offline Sync Ready
          </div>

          {/* Quick Primary Field Desk Action */}
          <Link
            href="/dashboard/field"
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            ⚡ Field Desk
          </Link>

          {/* GIS Link */}
          <Link
            href="/gis/parcels"
            className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
          >
            🗺️ Ground Plots
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
              <span className="w-8 h-8 rounded-full bg-[#B96E22] text-white font-bold text-xs flex items-center justify-center ring-1 ring-amber-400">
                {user.name ? user.name[0].toUpperCase() : 'F'}
              </span>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#122C4A] leading-tight">{user.name}</span>
                <span className="text-[10px] text-[#B96E22] font-semibold">Surveyor / RI</span>
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
                      item.highlightAmber
                        ? 'text-amber-300 font-bold hover:bg-[#0E243D]'
                        : isActive
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
            <span className="text-[11px] font-mono">Field Squad #44</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
