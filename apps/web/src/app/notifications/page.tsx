'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mock Data for Official Notifications
const NOTIFICATIONS_DATA = [
  {
    id: 'GAZ-2026-892',
    title: 'Preliminary Notification (Section 11) for Indore-Khandwa Highway Widening',
    type: 'Section 11',
    project: 'NH-44 Widening',
    district: 'Indore',
    date: '10 Sep 2026',
    size: '2.4 MB',
  },
  {
    id: 'GAZ-2026-875',
    title: 'Final Declaration (Section 19) for Narmada Valley Phase 3',
    type: 'Section 19',
    project: 'Narmada Canal Extension',
    district: 'Sehore',
    date: '28 Aug 2026',
    size: '5.1 MB',
  },
  {
    id: 'GAZ-2026-850',
    title: 'Award Order (Section 21) & Disbursement Schedule - Village Rau',
    type: 'Section 21',
    project: 'NH-44 Widening',
    district: 'Indore',
    date: '15 Aug 2026',
    size: '1.2 MB',
  },
  {
    id: 'CIR-2026-102',
    title: 'Updated Rural Multiplier Guidelines for Western MP Region',
    type: 'General Circular',
    project: 'State-wide',
    district: 'All Districts',
    date: '01 Aug 2026',
    size: '800 KB',
  },
];

export default function NotificationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Filter Logic
  const filteredNotifications = NOTIFICATIONS_DATA.filter((notif) => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notif.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notif.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || notif.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430]">
      
      {/* HEADER SECTION */}
      <div className="bg-[#122C4A] text-white py-12 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-[#9FB0C4] hover:text-white mb-6 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#FDF8E3] mb-3">Official Notifications & Orders</h1>
          <p className="text-[#9FB0C4] max-w-2xl">
            Search and download digitally signed Gazette notifications, circulars, and land acquisition awards under the RFCTLARR Act, 2013.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
        
        {/* SEARCH & FILTER BAR */}
        <div className="bg-white border border-[#DDD8C8] rounded-lg shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search by project name, district, or keyword..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8] text-sm"
            />
          </div>
          <div className="md:w-64">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8] text-sm font-semibold text-[#122C4A]"
            >
              <option value="All">All Notification Types</option>
              <option value="Section 11">Section 11 (Preliminary)</option>
              <option value="Section 19">Section 19 (Declaration)</option>
              <option value="Section 21">Section 21 (Award)</option>
              <option value="General Circular">General Circulars</option>
            </select>
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="bg-white border border-[#DDD8C8] rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DDD8C8] bg-[#FDF8E3] flex justify-between items-center">
            <h2 className="text-base font-bold text-[#122C4A]">Published Documents</h2>
            <span className="text-xs font-bold text-[#B96E22]">{filteredNotifications.length} Results Found</span>
          </div>
          
          {filteredNotifications.length > 0 ? (
            <ul className="divide-y divide-[#DDD8C8]">
              {filteredNotifications.map((notif) => (
                <li key={notif.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide
                        ${notif.type === 'Section 11' ? 'bg-blue-100 text-blue-800' : 
                          notif.type === 'Section 19' ? 'bg-amber-100 text-amber-800' : 
                          notif.type === 'Section 21' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-200 text-gray-700'}`}
                      >
                        {notif.type}
                      </span>
                      <span className="text-xs font-bold text-[#5B6472]">ID: {notif.id}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#122C4A] mb-1.5 leading-snug">{notif.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5B6472]">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#B96E22]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        {notif.project}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#B96E22]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {notif.district}
                      </span>
                      <span className="flex items-center gap-1 text-[#1D5FA8]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {notif.date}
                      </span>
                    </div>
                  </div>

                  <button className="shrink-0 flex items-center justify-center gap-2 bg-white border-2 border-[#122C4A] text-[#122C4A] hover:bg-[#122C4A] hover:text-white font-bold py-2 px-6 rounded transition-colors w-full md:w-auto shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download PDF <span className="text-[10px] opacity-80 font-normal">({notif.size})</span>
                  </button>
                  
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-12 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="text-lg font-bold text-[#122C4A]">No Notifications Found</h3>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}