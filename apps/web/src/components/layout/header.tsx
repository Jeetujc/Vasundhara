'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { authService, type AuthUser } from '../../services/auth.service';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = authService.getSession();
    if (session?.user) {
      setUser(session.user);
    }
  }, [pathname]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push('/login/mainlogin');
  };

  const isOfficer =
    user &&
    [
      'ADMIN',
      'CENTRAL_OFFICER',
      'STATE_OFFICER',
      'DISTRICT_OFFICER',
      'FIELD_OFFICER',
    ].includes(user.role);

  const isFieldOfficer = user?.role === 'FIELD_OFFICER';

  return (
    <header className="bg-[#FBFAF6] text-[#1B2430] font-sans border-b border-[#DDD8C8] shadow-sm sticky top-0 z-50">
      {/* Top identity bar */}
      <div className="flex flex-wrap items-center justify-between px-6 lg:px-8 py-3 bg-white border-b-[3px] border-[#122C4A] gap-4">
        {/* LEFT ALIGNED LOGO & IDENTITY */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[11px] leading-[1.45] text-[#5B6472] font-semibold">
            <img
              src="/Ministry_of_Rural_Development.png"
              alt="Ministry of Rural Development"
              className="h-14 md:h-16 w-auto object-contain"
            />
          </Link>

          <div className="flex flex-col pl-4 border-l border-[#DDD8C8]">
            <Link
              href="/"
              className="font-serif font-bold text-2xl md:text-3xl text-[#122C4A] tracking-[0.01em] leading-none hover:opacity-90"
            >
              VASUNDHARA
            </Link>
            <span className="text-xs text-[#5B6472] mt-1 hidden sm:block">
              {t('app.subtitle', 'National Land Acquisition & Management System')}
            </span>
          </div>
        </div>

        {/* RIGHT ALIGNED ACTIONS */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Quick Field Officer Work Management Button */}
          <Link
            href="/dashboard/field"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition shadow-sm ${
              pathname === '/dashboard/field'
                ? 'bg-[#B96E22] text-white ring-2 ring-[#B96E22]/50'
                : 'bg-[#FDF8E3] text-[#B96E22] border border-[#E7DFB8] hover:bg-[#F5EACB]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Field Officer Work Management
          </Link>

          {/* Quick GIS Map Button */}
          <Link
            href="/gis"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition shadow-sm ${
              pathname?.startsWith('/gis')
                ? 'bg-[#1D5FA8] text-white ring-2 ring-[#1D5FA8]/50'
                : 'bg-blue-50 text-[#1D5FA8] border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            GIS Map
          </Link>

          {/* Language Toggle */}
          <div className="flex items-center text-xs font-semibold border border-[#DDD8C8] rounded-full overflow-hidden bg-[#FDF8E3]">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 transition-colors ${
                language === 'en'
                  ? 'bg-[#122C4A] text-white font-bold'
                  : 'text-[#122C4A] hover:bg-[#eae3cb]'
              }`}
            >
              EN
            </button>
            <span className="text-[#DDD8C8]">|</span>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 transition-colors ${
                language === 'hi'
                  ? 'bg-[#122C4A] text-white font-bold'
                  : 'text-[#122C4A] hover:bg-[#eae3cb]'
              }`}
            >
              HI
            </button>
          </div>

          {/* Auth State Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="text-xs font-bold text-[#122C4A] hover:underline flex items-center gap-1.5"
              >
                <span className="w-6 h-6 rounded-full bg-[#122C4A] text-white flex items-center justify-center text-[10px]">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </span>
                <span className="hidden md:inline">{user.name}</span>
                <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded uppercase font-semibold">
                  {user.role.replace('_', ' ')}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login/mainlogin"
                className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold px-3.5 py-1.5 rounded transition shadow-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-[#122C4A] text-[#122C4A] hover:bg-gray-100 text-xs font-bold px-3 py-1.5 rounded transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Global Application Navigation Bar */}
      <nav className="bg-[#122C4A] text-white px-6 lg:px-8 py-0 overflow-x-auto shadow-inner">
        <div className="flex items-center justify-between min-w-max">
          <ul className="flex items-center list-none m-0 p-0 text-xs font-semibold tracking-wide">
            <li>
              <Link
                href="/"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname === '/' ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname?.startsWith('/projects') ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/parcels"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname?.startsWith('/parcels') ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Parcels
              </Link>
            </li>
            <li>
              <Link
                href="/gis"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname?.startsWith('/gis') ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                GIS Map Portal
              </Link>
            </li>
            <li>
              <Link
                href="/workflow"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname === '/workflow' ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Workflow
              </Link>
            </li>
            <li>
              <Link
                href="/workflow/tasks"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname === '/workflow/tasks' ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Tasks
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/field"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#B96E22] ${
                  pathname === '/dashboard/field' ? 'bg-[#B96E22] font-bold text-white' : 'text-amber-300 font-bold'
                }`}
              >
                ⚡ Field Work Management
              </Link>
            </li>
            <li>
              <Link
                href="/compensation"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname?.startsWith('/compensation') ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Compensation
              </Link>
            </li>
            <li>
              <Link
                href="/possession"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname === '/possession' ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Possession
              </Link>
            </li>
            <li>
              <Link
                href="/r-and-r"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname === '/r-and-r' ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                R&amp;R
              </Link>
            </li>
            <li>
              <Link
                href="/documents"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname === '/documents' ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Documents
              </Link>
            </li>
            <li>
              <Link
                href="/reports"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname === '/reports' ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Reports
              </Link>
            </li>
            <li>
              <Link
                href="/grivence/citizen"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname?.startsWith('/grivence') ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Grievances
              </Link>
            </li>
            <li>
              <Link
                href="/notifications"
                className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                  pathname === '/notifications' ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                }`}
              >
                Gazette Notices
              </Link>
            </li>
            {isOfficer && (
              <li>
                <Link
                  href="/admin"
                  className={`block px-3.5 py-2.5 transition-colors hover:bg-[#1D5FA8] ${
                    pathname === '/admin' ? 'bg-[#1D5FA8] font-bold text-white' : 'text-gray-200'
                  }`}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-2 pl-4 py-1">
            <Link
              href="/dashboard"
              className="text-[11px] bg-white/10 hover:bg-white/20 text-white font-semibold px-2.5 py-1 rounded transition whitespace-nowrap"
            >
              My Dashboard →
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}