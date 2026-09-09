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
        <h1 className="text-1xl font-bold text-[#1E3A8A] mb-2">
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
              citizen Login
            </button>
          </Link>
          <p className="text-xs text-gray-400 mt-4">
            Requires authorized NIC credentials and RBAC clearance.
          </p>
        </div>

      </div>
    </div>
  );
}