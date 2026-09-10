'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../../components/layout/header';
import { authService, type AuthUser } from '../../../services/auth.service';
import {
  grievanceService,
  type GrievanceItem,
} from '../../../services/grievance.service';
import { useLanguage } from '../../../context/LanguageContext';

export default function GrievancePortal() {
  const router = useRouter();
  const { t } = useLanguage();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [tickets, setTickets] = useState<GrievanceItem[]>([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [khasraNo, setKhasraNo] = useState('452/1');
  const [projectName, setProjectName] = useState('NH-44 Highway Widening');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicketNo, setSubmittedTicketNo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGrievanceData = async () => {
      try {
        const session = authService.getSession();
        if (!session) {
          router.replace('/login/mainlogin');
          return;
        }

        const [currentUser, myTickets] = await Promise.all([
          authService.getCurrentUser().catch(() => session.user),
          grievanceService.getMyGrievances().catch((err) => {
            console.warn('Could not load tickets:', err);
            return [];
          }),
        ]);

        setUser(currentUser);
        if (myTickets && myTickets.length > 0) {
          setTickets(myTickets);
        }
      } catch (err) {
        console.error('Grievance page init error:', err);
      }
    };

    loadGrievanceData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');

      const created = await grievanceService.create({
        category: category || 'asset_valuation',
        description,
        khasraNo,
      });

      setSubmittedTicketNo(created.ticketNo || `#G-${Math.floor(10000 + Math.random() * 90000)}`);
      setIsSubmitted(true);
      setDescription('');
      setCategory('');

      // Refresh tickets
      const updated = await grievanceService.getMyGrievances().catch(() => []);
      if (updated.length > 0) {
        setTickets(updated);
      } else {
        setTickets((prev) => [created, ...prev]);
      }

      setTimeout(() => setIsSubmitted(false), 8000);
    } catch (err: any) {
      console.error('Error submitting grievance:', err);
      setError(err?.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTickets: GrievanceItem[] = [
    {
      id: 'mock-1',
      ticketNo: 'G-10521',
      category: 'bank_transfer',
      description: 'Amount bounced due to IFSC code mismatch in the Aadhaar linked account.',
      status: 'IN_PROGRESS',
      createdAt: '12 Aug 2026',
    },
    {
      id: 'mock-2',
      ticketNo: 'G-10492',
      category: 'asset_valuation',
      description: 'Missing mango trees in asset calculation.',
      status: 'RESOLVED',
      resolution: 'CALA physical inspection conducted; 5 mango trees valued at ₹2,50,000 added to award.',
      createdAt: '04 May 2026',
    },
  ];

  const displayTickets = tickets.length > 0 ? tickets : defaultTickets;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#FBFAF6] p-6 lg:p-10 font-sans text-[#1B2430]">
        <div className="max-w-7xl mx-auto">
          {/* HEADER & BACK BUTTON */}
          <div className="mb-8">
            <Link
              href="/dashboard/citizen"
              className="inline-flex items-center text-sm font-bold text-[#1D5FA8] hover:text-[#122C4A] mb-4 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              {t('nav.back_dashboard', '← Back to Dashboard')}
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-[#122C4A]">
                  Grievance Redressal Portal
                </h1>
                <p className="text-[#5B6472] mt-1 text-sm md:text-base">
                  File official objections regarding your land acquisition award or R&R benefits.
                </p>
              </div>
              <div className="bg-[#FDF8E3] border border-[#E7DFB8] px-4 py-2 rounded shadow-sm text-sm font-bold text-[#B96E22]">
                Citizen ID: {user?.aadharId ? `XXXX-XXXX-${user.aadharId.slice(-4)}` : 'XXXX-XXXX-8921'}
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

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded p-4 text-sm">
                    {error}
                  </div>
                )}

                {isSubmitted && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="font-bold text-sm">Grievance Submitted Successfully</h4>
                      <p className="text-xs mt-1">
                        Your official ticket number is <strong>{submittedTicketNo}</strong>. The Competent Authority (CALA) will review your request within 7 working days.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subject Category */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-[#5B6472] mb-1.5">
                        Grievance Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8] text-sm"
                      >
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
                      <label className="block text-sm font-bold text-[#5B6472] mb-1.5">
                        Affected Project
                      </label>
                      <input
                        type="text"
                        disabled
                        value={projectName}
                        className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>

                    {/* Related Khasra */}
                    <div>
                      <label className="block text-sm font-bold text-[#5B6472] mb-1.5">
                        Affected Khasra No.
                      </label>
                      <input
                        type="text"
                        disabled
                        value={khasraNo}
                        className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please explain the issue in detail..."
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8] text-sm resize-y"
                    ></textarea>
                  </div>

                  {/* File Upload */}
                  <div className="bg-[#FDF8E3] border border-dashed border-[#B96E22] rounded p-6 text-center">
                    <svg className="w-8 h-8 text-[#B96E22] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-bold text-[#122C4A]">Upload Supporting Evidence</p>
                    <p className="text-xs text-[#5B6472] mt-1 mb-4">
                      Attach photos of missing assets, bank passbook, or registry papers (Max 5MB PDF/JPG)
                    </p>
                    <label className="cursor-pointer bg-white border border-[#DDD8C8] text-[#122C4A] hover:bg-gray-50 font-bold py-2 px-4 rounded text-xs transition-colors inline-block">
                      Browse Files
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-[#DDD8C8] flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#1D5FA8] hover:bg-[#122C4A] text-white font-bold py-3 px-8 rounded shadow-sm transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
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
                  {displayTickets.map((ticket) => {
                    const isResolved = ticket.status.toLowerCase() === 'resolved';
                    return (
                      <li
                        key={ticket.id}
                        className={`p-4 rounded transition-colors cursor-pointer border ${
                          isResolved
                            ? 'bg-[#FDF8E3] border-[#E7DFB8]'
                            : 'bg-[#F8FAFC] border-[#DDD8C8] hover:border-[#1D5FA8]'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-[#1B2430]">
                            Ticket #{ticket.ticketNo}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                              isResolved
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#5B6472] mb-1 uppercase tracking-wide">
                          {ticket.category.replace('_', ' ')}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                          {ticket.description}
                        </p>
                        {ticket.resolution && (
                          <div className="bg-white p-2 rounded border border-[#DDD8C8] text-[11px] text-emerald-800 mb-2">
                            <strong>Resolution:</strong> {ticket.resolution}
                          </div>
                        )}
                        <div className="text-[10px] text-gray-500 font-semibold flex items-center justify-between">
                          <span>
                            {typeof ticket.createdAt === 'string' && ticket.createdAt.includes('T')
                              ? new Date(ticket.createdAt).toLocaleDateString('en-IN')
                              : ticket.createdAt}
                          </span>
                          <span className="text-[#1D5FA8]">
                            {isResolved ? 'View Resolution →' : 'View Updates →'}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}