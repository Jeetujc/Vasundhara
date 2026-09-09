'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  // State for Citizen Login
  const [citizenCredentials, setCitizenCredentials] = useState({
    userId: '',
    password: '',
  });

  // State for Authority Login
  const [authorityCredentials, setAuthorityCredentials] = useState({
    level: '',
    userId: '',
    password: '',
  });

  // Explicit TypeScript type for form submit event
  const handleCitizenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Citizen Login Submitted:', citizenCredentials);
  };

  // Explicit TypeScript type for form submit event
  const handleAuthoritySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Authority Login Submitted:', authorityCredentials);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      {/* Official Government Branding Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-2">
          VASUNDHARA
        </h1>
        <h1 className="text-xl font-bold text-[#1E3A8A] mb-2">
          National Land Acquisition & Management System
        </h1>
        <p className="text-[#0F172A] text-lg">
          Secure Access Portal
        </p>
      </div>

      {/* Login Cards Container */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">

        {/* Citizen Login Card */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">Citizen Portal</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Access land records, track acquisition status, and submit claims or grievances.
          </p>

          <form onSubmit={handleCitizenSubmit} className="w-full flex flex-col gap-4 text-left">
            {/* User ID Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                adhaar number
              </label>
              <input
                type="text"
                required
                placeholder="adhaar number"
                value={citizenCredentials.userId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setCitizenCredentials({ ...citizenCredentials, userId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm text-gray-800"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter Password"
                value={citizenCredentials.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setCitizenCredentials({ ...citizenCredentials, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm text-gray-800"
              />
            </div>

            {/* Extra Options */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" className="rounded text-[#F59E0B] focus:ring-[#F59E0B]" />
                Remember me
              </label>
              <a href="#" className="hover:underline text-[#D97706]">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-3 px-4 rounded transition-colors mt-2"
            >
              Citizen Login
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-6">
            New user?{' '}
            <a href="#" className="text-[#D97706] font-semibold hover:underline">
              Register here
            </a>
          </p>
        </div>

        {/* Authority Login Card */}
        

      </div>
    </div>
  );
}