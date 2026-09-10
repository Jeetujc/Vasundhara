'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/header';

interface ApprovalItem {
  id: string;
  stage: string;
  project: string;
  district: string;
  actSection: string;
  details: string;
  officerRole: string;
  signed: boolean;
}

const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'appr-1',
    stage: 'Preliminary Notification',
    project: 'NH-44 Highway Widening (Jabalpur Stretch)',
    district: 'Jabalpur',
    actSection: 'Section 11(1)',
    details: 'Gazette notification draft for 452.5 Hectares across Panagar and Majholi tehsils.',
    officerRole: 'District Collector / CALA',
    signed: false,
  },
  {
    id: 'appr-2',
    stage: 'Final Declaration & Summary of Rehabilitation',
    project: 'Dedicated Freight Corridor (East-West)',
    district: 'Jabalpur',
    actSection: 'Section 19(1)',
    details: 'Conclusive declaration of public purpose and R&R entitlement package approval.',
    officerRole: 'State Revenue Secretary',
    signed: false,
  },
  {
    id: 'appr-3',
    stage: 'Final Compensation Award Order',
    project: 'Narmada Valley Canal Network Phase 3',
    district: 'Jabalpur',
    actSection: 'Section 21 & Section 23',
    details: 'Award orders of ₹80,50,000 with 100% Solatium & 12% additional market value component.',
    officerRole: 'Competent Authority (CALA)',
    signed: true,
  },
];

export default function WorkflowApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);

  const handleSign = (id: string, title: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, signed: true } : a))
    );
    alert(`Digital DSC Applied: Statutory approval e-signed for "${title}". Sealed into permanent audit log.`);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430]">
      <Header />

      {/* Sub-nav */}
      <nav className="bg-[#0E243D] text-white px-8 py-2.5 flex flex-wrap items-center justify-between border-b border-[#1D5FA8]/40 shadow-sm text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#F2A71B] uppercase tracking-wider flex items-center gap-1.5">
            🔏 Statutory Sign-Offs &amp; DSC Authority
          </span>
          <div className="flex items-center gap-1">
            <Link href="/workflow" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Workflows
            </Link>
            <Link href="/workflow/tasks" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Tasks
            </Link>
            <Link href="/workflow/pending" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Pending Transitions
            </Link>
            <Link href="/workflow/approvals" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
              Statutory Sign-Offs
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/field" className="bg-[#B96E22] hover:bg-[#965516] text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1">
            ⚡ Field Officer Work Management
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Statutory Approvals &amp; Gazette Sign-Off Queue</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              Digital Signature Certificate (DSC) authorized approvals for RFCTLARR Act statutory gazette publications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {approvals.map((appr) => (
            <div
              key={appr.id}
              className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#122C4A] text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                    {appr.actSection}
                  </span>
                  <span className="text-xs font-bold text-[#B96E22]">{appr.stage}</span>
                  <span className="text-xs text-gray-400">| District: {appr.district}</span>
                </div>

                <h3 className="text-lg font-bold text-[#122C4A]">{appr.project}</h3>

                <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                  {appr.details}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                  <span>Signatory Level: <strong className="text-gray-800">{appr.officerRole}</strong></span>
                  <span>•</span>
                  <span>Audit Hash: <span className="font-mono text-gray-500">SHA256-OK</span></span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                {appr.signed ? (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg text-xs font-bold">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Digitally Sealed &amp; Gazette Published
                  </div>
                ) : (
                  <button
                    onClick={() => handleSign(appr.id, appr.stage)}
                    className="w-full md:w-auto bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold py-2.5 px-6 rounded-lg text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 text-[#F2A71B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Apply DSC e-Signature
                  </button>
                )}
                <Link
                  href="/notifications"
                  className="text-xs text-[#1D5FA8] font-bold hover:underline"
                >
                  View Gazette Notice →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
