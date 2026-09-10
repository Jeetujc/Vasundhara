import React from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/header'

export default function CitizenDashboard() {
  return (
    <> <Header/>
     {/* Nav */}
      <nav className="bg-[#122C4A] flex flex-wrap items-center px-8 py-2 md:py-0">
        <ul className="flex flex-wrap flex-1 list-none m-0 p-0">
          {[
            { name: 'Home', href: '/' },
            { name: 'About Us', href: '/#about-us' },
            { name: 'Notification', href: '/#notification' },
            { name: 'Act', href: 'https://mwcc.org.in/knowledge%20center/LandAcqisition/landAcquisitionAct-2013-.pdf',newTab: true }, // This now points to your Act page folder!
            { name: 'Projects', href: '/#projects' },
            { name: 'Important Links', href: '/#important-links' }
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="block px-[18px] py-[14px] text-[#EAF0F7] text-[13px] font-semibold tracking-[0.02em] hover:bg-[#0B1F35] transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    <div className="min-h-screen bg-[#FBFAF6] p-6 lg:p-10 font-sans text-[#1B2430]">
      <div className="max-w-[1280px] mx-auto">
        
        {/* TOP HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#122C4A]">Dashboard</h1>
            <p className="text-[#5B6472] mt-1 text-sm md:text-base">Welcome back, <strong className="text-[#1B2430]">Ram Kumar</strong></p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-[#DDD8C8] px-4 py-2.5 rounded shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-bold text-[#122C4A]">Status: Award Declared & Ready for Disbursement</span>
          </div>
        </div>

        {/* 1. NEW: ACTION REQUIRED BANNER */}
        <div className="bg-[#FDF8E3] border-l-[6px] border-[#F2A71B] rounded shadow-sm p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-[#F2A71B] text-[#122C4A] p-2 rounded-full mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#B96E22]">Action Required: Bank Details Verification</h3>
              <p className="text-sm text-[#5B6472] mt-1">Your compensation of ₹80,00,000 is ready for transfer. Please verify your Aadhaar-linked bank account or upload a cancelled cheque to proceed.</p>
            </div>
          </div>
          <button className="whitespace-nowrap bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold py-2.5 px-6 rounded transition-colors w-full md:w-auto">
            Verify Now
          </button>
        </div>

        {/* MAIN 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: 60% Width */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Citizen & Land Details Card */}
            <div className="bg-white border border-[#DDD8C8] border-t-4 border-t-[#122C4A] rounded shadow-sm p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#DDD8C8]">
                <h2 className="text-xl font-serif font-bold text-[#122C4A]">Land Record Details</h2>
                <span className="text-xs font-bold bg-[#FDF8E3] text-[#B96E22] border border-[#E7DFB8] px-3 py-1 rounded-full">Verified</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <span className="block text-xs font-bold text-[#5B6472] uppercase tracking-wider mb-1">Owner Name</span>
                  <span className="text-[15px] font-semibold">Ram Kumar S/O Ramesh Kumar</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#5B6472] uppercase tracking-wider mb-1">Aadhaar Number</span>
                  <span className="text-[15px] font-semibold">XXXX-XXXX-8921</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#5B6472] uppercase tracking-wider mb-1">Khasra / Survey No.</span>
                  <span className="text-[15px] font-semibold text-[#1D5FA8]">452/1, 453</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-[#5B6472] uppercase tracking-wider mb-1">Total Acquired Area</span>
                  <span className="text-[15px] font-semibold">1.25 Hectares</span>
                </div>
                <div className="md:col-span-2">
                  <span className="block text-xs font-bold text-[#5B6472] uppercase tracking-wider mb-1">Location</span>
                  <span className="text-[15px] font-semibold">Village Rau, Tehsil Indore, District Indore, Madhya Pradesh</span>
                </div>
              </div>
            </div>

            {/* Compensation Award & NEW R&R Breakdown Card */}
            <div className="bg-[#0B1F35] text-white border border-[#1D5FA8] rounded shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 22h20L12 2zm0 3.83L19.17 20H4.83L12 5.83z"/></svg>
              </div>

              <h2 className="text-xl font-serif font-bold text-[#F2A71B] mb-6">Financial & R&R Award Breakdown</h2>
              
              <div className="space-y-4 text-sm border-b border-[#1D5FA8] pb-6 mb-6 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-[#9FB0C4]">Base Market Value <span className="text-xs">(1.25 Ha @ ₹20L/Ha)</span></span>
                  <span className="font-medium tracking-wide">₹ 25,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9FB0C4]">Location Multiplier (Rural 1.5x)</span>
                  <span className="font-medium tracking-wide">₹ 37,50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9FB0C4]">Value of Attached Assets (Trees/Well)</span>
                  <span className="font-medium tracking-wide">+ ₹ 2,50,000</span>
                </div>
              </div>

              <div className="space-y-4 text-sm border-b border-[#1D5FA8] pb-6 mb-6 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Basic Compensation</span>
                  <span className="font-semibold tracking-wide">₹ 40,00,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#9FB0C4]">Solatium (100% of Basic Comp.)</span>
                  <span className="font-semibold text-[#F2A71B] tracking-wide">+ ₹ 40,00,000</span>
                </div>
              </div>

              {/* 2. NEW: Rehabilitation & Resettlement (R&R) */}
              <div className="bg-[#122C4A] border border-[#1D5FA8] rounded p-4 mb-6 relative z-10">
                <h3 className="text-xs font-bold text-[#9FB0C4] uppercase tracking-wider mb-3">Rehabilitation & Resettlement Benefits</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#EAF0F7]">One-time Displacement Allowance</span>
                    <span className="font-bold text-[#F2A71B]">₹ 50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#EAF0F7]">Housing Plot Allocated</span>
                    <span className="font-bold text-white">Sector 4, Plot No. 12</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                <div>
                  <span className="block text-[#9FB0C4] text-xs font-bold uppercase tracking-wider mb-1">Total Final Cash Award</span>
                  <span className="text-3xl font-serif font-bold text-white tracking-wide">₹ 80,50,000</span>
                </div>
                
                <Link href="/audit" className="bg-[#F2A71B] hover:bg-[#D97706] text-[#0B1F35] font-bold py-2.5 px-5 rounded transition-colors text-sm text-center w-full sm:w-auto">
                  View Detailed Audit
                </Link>
              </div>
            </div>

            {/* Compensation Tracker (Stepper) */}
            <div className="bg-white border border-[#DDD8C8] rounded shadow-sm p-6">
              <h2 className="text-xl font-serif font-bold text-[#122C4A] mb-8">Acquisition Tracker</h2>
              
              <div className="relative border-l-2 border-[#DDD8C8] ml-4 space-y-8 pb-4">
                {/* Stepper code stays exactly the same as the previous version */}
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-green-500 rounded-full -left-[13px] top-0 border-4 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-sm font-bold text-[#122C4A]">Section 11 Notification</h3>
                  <span className="text-[10px] font-bold text-[#B96E22] mt-1 block">12 JAN 2026</span>
                </div>
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-green-500 rounded-full -left-[13px] top-0 border-4 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-sm font-bold text-[#122C4A]">Section 15 Hearing</h3>
                  <span className="text-[10px] font-bold text-[#B96E22] mt-1 block">05 MAR 2026</span>
                </div>
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-[#F2A71B] rounded-full -left-[13px] top-0 border-4 border-[#FDF8E3] shadow-sm animate-pulse"></div>
                  <h3 className="text-sm font-bold text-[#122C4A]">Award Declared & Bank Verification</h3>
                  <p className="text-xs text-[#5B6472] mt-1">Pending citizen bank account validation.</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-[#DDD8C8] rounded-full -left-[13px] top-0 border-4 border-white"></div>
                  <h3 className="text-sm font-bold text-[#9FB0C4]">Disbursement & Possession</h3>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 40% Width */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* GIS Map Card (Condensed version of previous) */}
            <div className="bg-white border border-[#DDD8C8] rounded shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#DDD8C8] flex justify-between items-center bg-[#F8FAFC]">
                <h2 className="text-sm font-bold text-[#122C4A]">GIS Spatial Map</h2>
                <span className="text-[10px] bg-[#1D5FA8] text-white px-2 py-1 rounded">Geo-Tagged</span>
              </div>
              <div className="relative w-full h-[220px] bg-[#E2E8F0] overflow-hidden flex items-center justify-center">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-20"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="none"></rect><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#122C4A" strokeWidth="1"></path></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"></rect></svg>
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="none"><path d="M0 250 Q 150 150 400 200" fill="none" stroke="#1D5FA8" strokeWidth="12" /></svg>
                <svg className="absolute z-10 w-full h-full drop-shadow-md" viewBox="0 0 400 300">
                  <polygon points="120,80 260,100 280,220 150,240 100,160" fill="rgba(242, 167, 27, 0.4)" stroke="#F2A71B" strokeWidth="3" />
                  <circle cx="180" cy="160" r="4" fill="#122C4A" />
                </svg>
              </div>
            </div>

            {/* 3. NEW: DOCUMENT VAULT */}
            <div className="bg-white border border-[#DDD8C8] rounded shadow-sm p-6">
              <h2 className="text-lg font-serif font-bold text-[#122C4A] mb-4">Document Vault</h2>
              <ul className="space-y-4">
                <li className="flex items-center justify-between p-3 border border-[#DDD8C8] rounded bg-[#F8FAFC] hover:bg-[#FDF8E3] transition">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#B96E22]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                    <span className="text-sm font-semibold text-[#1B2430]">Final Award Order (Sec 21)</span>
                  </div>
                  <button className="text-[#1D5FA8] hover:text-[#122C4A]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></button>
                </li>
                <li className="flex items-center justify-between p-3 border border-[#DDD8C8] rounded bg-[#F8FAFC] hover:bg-[#FDF8E3] transition">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#B96E22]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                    <span className="text-sm font-semibold text-[#1B2430]">Sec 11 Notification</span>
                  </div>
                  <button className="text-[#1D5FA8] hover:text-[#122C4A]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></button>
                </li>
              </ul>
            </div>

            {/* 4. NEW: GRIEVANCE & HELPDESK */}
            <div className="bg-[#FDF8E3] border border-[#E7DFB8] rounded shadow-sm p-6">

              <h2 className="text-lg font-serif font-bold text-[#122C4A] mb-2">Help & Grievances</h2>
              <p className="text-xs text-[#5B6472] mb-4">Having issues with your land area, asset calculation, or bank transfer? Raise an official grievance here.</p>
              
              <Link href="../../grivence/citizen" className="w-full block">
              <button className="w-full bg-white border-2 border-[#122C4A] text-[#122C4A] font-bold py-2 rounded hover:bg-[#122C4A] hover:text-white transition-colors mb-4">
                   + Raise New Grievance
               </button>
                </Link>

              <div className="bg-white p-3 rounded border border-[#DDD8C8]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#1B2430]">Ticket #G-10492</span>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">Resolved</span>
                </div>
                <p className="text-xs text-[#5B6472]">Missing mango trees in asset calculation.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    </>
  );
}