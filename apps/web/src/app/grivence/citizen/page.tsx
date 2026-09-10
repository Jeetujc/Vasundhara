'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function GrievancePortal() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to your backend here
    setIsSubmitted(true);
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] p-6 lg:p-10 font-sans text-[#1B2430]">
      <div className="max-w-[1280px] mx-auto">
        
        {/* HEADER & BACK BUTTON */}
        <div className="mb-8">
          <Link href="/citizen" className="inline-flex items-center text-sm font-bold text-[#1D5FA8] hover:text-[#122C4A] mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#122C4A]">Grievance Redressal Portal</h1>
              <p className="text-[#5B6472] mt-1 text-sm md:text-base">File official objections regarding your land acquisition award or R&R benefits.</p>
            </div>
            <div className="bg-[#FDF8E3] border border-[#E7DFB8] px-4 py-2 rounded shadow-sm text-sm font-bold text-[#B96E22]">
              Citizen ID: XXXX-XXXX-8921
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: NEW GRIEVANCE FORM (66% Width) */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#DDD8C8] border-t-4 border-t-[#122C4A] rounded shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-serif font-bold text-[#122C4A] mb-6 pb-4 border-b border-[#DDD8C8]">
                Raise a New Grievance
              </h2>

              {isSubmitted && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <div>
                    <h4 className="font-bold text-sm">Grievance Submitted Successfully</h4>
                    <p className="text-xs mt-1">Your temporary ticket number is <strong>#G-10588</strong>. The Competent Authority (CALA) will review your request within 7 working days.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Subject Category */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Grievance Category <span className="text-red-500">*</span></label>
                    <select required className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8] text-sm">
                      <option value="">Select Category...</option>
                      <option value="asset_valuation">Asset Valuation (Missing Trees, Buildings)</option>
                      <option value="area_mismatch">Land Area / Measurement Mismatch</option>
                      <option value="title_dispute">Ownership / Title Dispute (Sec 77)</option>
                      <option value="rr_benefits">Missing Rehabilitation & Resettlement (R&R) Benefits</option>
                      <option value="bank_transfer">Bank Account / Fund Transfer Failure</option>
                    </select>
                  </div>

                  {/* Related Project */}
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Affected Project</label>
                    <input type="text" disabled value="NH-44 Highway Widening" className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded text-gray-500 text-sm cursor-not-allowed" />
                  </div>

                  {/* Related Khasra */}
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Affected Khasra No.</label>
                    <input type="text" disabled value="452/1, 453" className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded text-gray-500 text-sm cursor-not-allowed" />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Detailed Description <span className="text-red-500">*</span></label>
                  <textarea required rows={5} placeholder="Please explain the issue in detail..." className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8] text-sm resize-y"></textarea>
                </div>

                {/* File Upload */}
                <div className="bg-[#FDF8E3] border border-dashed border-[#B96E22] rounded p-6 text-center">
                  <svg className="w-8 h-8 text-[#B96E22] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p className="text-sm font-bold text-[#122C4A]">Upload Supporting Evidence</p>
                  <p className="text-xs text-[#5B6472] mt-1 mb-4">Attach photos of missing assets, bank passbook, or registry papers (Max 5MB PDF/JPG)</p>
                  <label className="cursor-pointer bg-white border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 font-bold py-2 px-4 rounded text-xs transition-colors inline-block">
                    Browse Files
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-[#DDD8C8] flex justify-end">
                  <button type="submit" className="bg-[#1D5FA8] hover:bg-[#122C4A] text-white font-bold py-3 px-8 rounded shadow-sm transition-colors">
                    Submit Grievance
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: TICKET HISTORY (34% Width) */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white border border-[#DDD8C8] rounded shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-serif font-bold text-[#122C4A] mb-4 pb-3 border-b border-[#DDD8C8]">
                Your Ticket History
              </h2>

              <ul className="space-y-4">
                
                {/* Active/Pending Ticket */}
                <li className="bg-[#F8FAFC] border border-[#DDD8C8] p-4 rounded hover:border-[#1D5FA8] transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-[#1B2430]">Ticket #G-10521</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full uppercase tracking-wide">In Progress</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#5B6472] mb-1">Bank Transfer Failure</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">Amount bounced due to IFSC code mismatch in the Aadhaar linked account.</p>
                  <div className="text-[10px] text-gray-400 font-semibold flex items-center justify-between">
                    <span>Filed: 12 Aug 2026</span>
                    <span className="text-[#1D5FA8]">View Updates &rarr;</span>
                  </div>
                </li>

                {/* Resolved Ticket (From your screenshot) */}
                <li className="bg-[#FDF8E3] border border-[#E7DFB8] p-4 rounded cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-[#1B2430]">Ticket #G-10492</span>
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full uppercase tracking-wide">Resolved</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#5B6472] mb-1">Asset Valuation</h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">Missing mango trees in asset calculation.</p>
                  <div className="text-[10px] text-gray-500 font-semibold flex items-center justify-between">
                    <span>Closed: 04 May 2026</span>
                    <span className="text-[#1D5FA8]">View Resolution &rarr;</span>
                  </div>
                </li>

              </ul>
              
              <button className="w-full mt-6 text-xs font-bold text-[#1D5FA8] bg-white border border-[#1D5FA8] py-2.5 rounded hover:bg-[#F8FAFC] transition">
                Load Older Tickets
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}