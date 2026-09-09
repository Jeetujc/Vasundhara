'use client'; // <-- ADD THIS AS LINE 1

import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
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
        
        {/* Official / Department Login */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-4">Official Workspace</h2>
          <p className="text-gray-600 mb-8">
            Access Ministry dashboards, Collector action queues, and MIS reports.
          </p>
          <Link href="./departmentlogin" className="w-full block">
            <button className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-3 px-4 rounded transition-colors">
              Department Login
            </button>
          </Link>
          <p className="text-xs text-gray-400 mt-4">
            Requires authorized NIC credentials and RBAC clearance.
          </p>
        </div>

        {/* Authority Login Box */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-4">Authority Login</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Select your authority tier and sign in with your credentials.
          </p>
          
          <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col gap-4 text-left">
            {/* Authority Level Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Authority Level
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm bg-white text-gray-800">
                <option value="">Select Authority Level</option>
                <option value="central">Central Authority</option>
                <option value="state">State Authority</option>
                <option value="district">District Authority</option>
                <option value="field_officer">Field Officer</option>
              </select>
            </div>

            {/* User ID Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                User ID / Employee ID
              </label>
              <input 
                type="text" 
                placeholder="Enter User ID" 
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm text-gray-800"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Password
              </label>
              <input 
                type="password" 
                placeholder="Enter Password" 
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm text-gray-800"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-[#1E3A8A] hover:bg-[#172b69] text-white font-bold py-3 px-4 rounded transition-colors mt-2"
            >
              Sign In
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}