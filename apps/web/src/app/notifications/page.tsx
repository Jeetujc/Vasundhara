'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MainLogin() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<'citizen' | 'district' | 'state' | 'national'>('citizen');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication verification here, then route to the selected dashboard
    router.push(`/${activeRole}`);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] flex flex-col md:flex-row font-sans text-[#1B2430]">
      
      {/* LEFT SIDE: Branding & Context */}
      <div className="md:w-5/12 bg-[#122C4A] text-white p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" fill="currentColor" viewBox="0 0 100 100"><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"></path></pattern><rect width="100%" height="100%" fill="url(#grid)"></rect></svg>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-[#F2A71B] hover:text-white mb-12 transition-colors">
            &larr; Back to Home
          </Link>
          
          <div className="w-16 h-16 mb-6">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#F2A71B" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#F2A71B" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="4" fill="#F2A71B" />
            </svg>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-4 text-[#FDF8E3]">
            VASUNDHARA
          </h1>
          <p className="text-[#9FB0C4] text-lg leading-relaxed max-w-sm">
            National Land Acquisition & Management System. Ensuring transparent, real-time tracking for citizens and administrators.
          </p>
        </div>
        
        <div className="relative z-10 mt-12 pt-8 border-t border-[#1D5FA8] text-sm text-[#9FB0C4]">
          <p>Government of India &copy; 2026</p>
          <p>Ministry of Rural Development</p>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Login Form */}
      <div className="md:w-7/12 p-10 lg:p-16 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-serif font-bold text-[#122C4A] mb-2">Sign in to your account</h2>
          <p className="text-sm text-[#5B6472] mb-8">Select your designated portal access level to continue.</p>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-8 bg-[#F8FAFC] p-1.5 rounded-lg border border-[#DDD8C8]">
            <button 
              onClick={() => setActiveRole('citizen')}
              className={`py-2 px-2 text-xs font-bold rounded transition-all ${activeRole === 'citizen' ? 'bg-white text-[#122C4A] shadow-sm border border-[#DDD8C8]' : 'text-[#5B6472] hover:text-[#122C4A]'}`}
            >
              Citizen Portal
            </button>
            <button 
              onClick={() => setActiveRole('district')}
              className={`py-2 px-2 text-xs font-bold rounded transition-all ${activeRole === 'district' ? 'bg-white text-[#122C4A] shadow-sm border border-[#DDD8C8]' : 'text-[#5B6472] hover:text-[#122C4A]'}`}
            >
              District (CALA)
            </button>
            <button 
              onClick={() => setActiveRole('state')}
              className={`py-2 px-2 text-xs font-bold rounded transition-all ${activeRole === 'state' ? 'bg-white text-[#122C4A] shadow-sm border border-[#DDD8C8]' : 'text-[#5B6472] hover:text-[#122C4A]'}`}
            >
              State Admin
            </button>
            <button 
              onClick={() => setActiveRole('national')}
              className={`py-2 px-2 text-xs font-bold rounded transition-all ${activeRole === 'national' ? 'bg-white text-[#122C4A] shadow-sm border border-[#DDD8C8]' : 'text-[#5B6472] hover:text-[#122C4A]'}`}
            >
              National Ministry
            </button>
          </div>

          {/* Dynamic Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {activeRole === 'citizen' ? (
              <>
                <div>
                  <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Aadhaar Number / Mobile</label>
                  <input required type="text" placeholder="XXXX-XXXX-XXXX" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#5B6472] mb-1.5">OTP</label>
                  <div className="flex gap-2">
                    <input required type="password" placeholder="6-digit OTP" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                    <button type="button" className="bg-[#EAF0F7] text-[#1D5FA8] font-bold px-4 rounded border border-[#DDD8C8] hover:bg-[#DDD8C8] transition whitespace-nowrap text-sm">
                      Get OTP
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Department ID / Email</label>
                  <input required type="text" placeholder={`Enter ${activeRole} ID`} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-bold text-[#5B6472]">Password</label>
                    <Link href="#" className="text-xs font-bold text-[#1D5FA8] hover:underline">Forgot?</Link>
                  </div>
                  <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                </div>
              </>
            )}

            <button type="submit" className="w-full bg-[#F2A71B] hover:bg-[#D97706] text-[#0B1F35] font-bold py-3.5 px-4 rounded shadow-sm transition-colors mt-2 text-sm uppercase tracking-wide">
              Authenticate & Access {activeRole} Portal
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}