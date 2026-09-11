'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import Header from '../../../components/layout/header';

const TABS = [
  { label: 'Overview', segment: 'overview' },
  { label: 'Parcels', segment: 'parcels' },
  { label: 'Workflow', segment: 'workflow' },
  { label: 'Compensation', segment: 'compensation' },
  { label: 'Possession', segment: 'possession' },
  { label: 'R&R', segment: 'r-and-r' },
  { label: 'Documents', segment: 'documents' },
  { label: 'Audit', segment: 'audit' },
];

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params?.projectId as string;

  return (
    <>
      <Header />
      <nav className="bg-[#122C4A] flex flex-wrap items-center justify-between px-8 py-2 text-xs">
        <ul className="flex flex-wrap items-center list-none m-0 p-0 font-semibold">
          <li><Link href="/projects" className="text-white px-3.5 py-2 block hover:bg-[#1D5FA8]">← Projects</Link></li>
          <li><Link href={`/gis?projectId=${projectId}`} className="text-blue-300 px-3.5 py-2 block hover:bg-[#1D5FA8] hover:text-white font-bold">🗺️ Project GIS Map</Link></li>
          <li><Link href="/workflow/tasks" className="text-white px-3.5 py-2 block hover:bg-[#1D5FA8]">Tasks</Link></li>
        </ul>
        <div className="text-gray-300 font-mono text-[11px]">
          Project ID: {projectId.slice(-8)}
        </div>
      </nav>
      {/* Tab Bar */}
      <div className="bg-white border-b border-[#E8E4D9] px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
          <div className="flex">
            {TABS.map((tab) => {
              const href = `/projects/${projectId}/${tab.segment}`;
              const isActive = pathname === href || pathname?.startsWith(href + '/');
              return (
                <Link key={tab.segment} href={href}
                  className={`px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-[#1D5FA8] text-[#1D5FA8] font-bold'
                      : 'border-transparent text-[#5B6472] hover:text-[#122C4A] hover:border-[#DDD8C8]'
                  }`}>
                  {tab.label}
                </Link>
              );
            })}
            <Link
              href={`/gis?projectId=${projectId}`}
              className="px-5 py-3 text-sm font-bold text-[#1D5FA8] hover:text-[#122C4A] border-b-2 border-transparent hover:border-[#1D5FA8] whitespace-nowrap flex items-center gap-1"
            >
              🗺️ GIS Map
            </Link>
          </div>
        </div>
      </div>
      {/* Page Content */}
      <div className="min-h-screen bg-[#FBFAF6]">
        {children}
      </div>
    </>
  );
}
