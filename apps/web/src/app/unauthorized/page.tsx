'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../../components/layout/header';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430] flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white border border-[#DDD8C8] rounded-xl shadow-lg max-w-lg w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>

          <div>
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 border border-red-200 px-3 py-1 rounded">
              Access Restricted (403)
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A] mt-3">
              Geographic &amp; Role Restriction
            </h1>
            <p className="text-xs text-[#5B6472] mt-2 leading-relaxed">
              Your logged-in credential does not have authorization to access this jurisdiction or administration workflow under statutory RBAC policies.
            </p>
          </div>

          <div className="bg-[#FDF8E3] border border-[#E7DFB8] rounded-lg p-4 text-xs text-left space-y-1">
            <span className="font-bold text-[#B96E22] uppercase tracking-wider text-[10px]">
              Statutory Security Policy
            </span>
            <p className="text-gray-700">
              Only authorized officers within their assigned State, District CALA, or Tehsil jurisdiction can view or mutate these records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/dashboard"
              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold py-2.5 px-4 rounded transition shadow-sm"
            >
              Go to My Authorized Dashboard →
            </Link>
            <Link
              href="/login/mainlogin"
              className="border border-[#122C4A] text-[#122C4A] hover:bg-gray-50 text-xs font-bold py-2.5 px-4 rounded transition"
            >
              Switch Account / Login
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-center">
            <Link href="/" className="text-xs text-gray-500 hover:underline">
              Return to Vasundhara Portal Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
