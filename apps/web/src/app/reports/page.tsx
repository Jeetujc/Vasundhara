'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/header';

const REPORT_TEMPLATES = [
  {
    id: 'rep-1',
    title: 'Statutory Land Acquisition Progress MIS (Section 11 to Section 38)',
    category: 'Progress Report',
    period: 'Q3 FY 2026-27',
    recordsCount: 42,
    description: 'Comprehensive timeline tracking for all notified parcels, public hearing inquiries, award declarations, and physical handovers.',
  },
  {
    id: 'rep-2',
    title: 'PFMS Direct Benefit Transfer (DBT) Compensation Statement',
    category: 'Financial Statement',
    period: 'Current Financial Year',
    recordsCount: 156,
    description: 'Detailed statement of bank disbursements, Aadhaar validation status, escrow deductions, and 100% solatium payments.',
  },
  {
    id: 'rep-3',
    title: 'Rehabilitation & Resettlement (R&R) Compliance Report',
    category: 'Social Compliance',
    period: 'Cumulative',
    recordsCount: 84,
    description: 'Statutory audit of housing plot allocations, displacement allowances, and civic amenities under the Second & Third Schedules.',
  },
  {
    id: 'rep-4',
    title: 'Public Grievance Redressal & Disposal Statement',
    category: 'Citizen Services',
    period: 'Last 30 Days',
    recordsCount: 28,
    description: 'Audit of citizen objections, survey discrepancy flags, and CALA dispute resolutions under statutory deadlines.',
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>('rep-1');
  const [generating, setGenerating] = useState(false);

  const handleExportCsv = (title: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Project Code,Project Name,District,State,Notified Area (Ha),Acquired Area (Ha),Compensation Disbursed (Cr),PAF Count,Status\n' +
      'NH44-JBP,NH-44 Highway Widening,Jabalpur,Madhya Pradesh,420.50,310.20,80.50,124,ACQUISITION_IN_PROGRESS\n' +
      'DFC-MP-01,Dedicated Freight Corridor,Jabalpur,Madhya Pradesh,650.00,240.00,45.20,84,NOTIFIED\n' +
      'NVCN-MP-03,Narmada Valley Canal Network,Jabalpur,Madhya Pradesh,850.00,810.00,120.00,215,AWARD_DECLARED\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.slice(0, 20).replace(/\s+/g, '_')}_MIS.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (title: string) => {
    alert(`Compiling official Ministry print layout for: "${title}". Opening system print spooler...`);
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430]">
      <Header />

      {/* Sub-nav */}
      <nav className="bg-[#0E243D] text-white px-8 py-2.5 flex flex-wrap items-center justify-between border-b border-[#1D5FA8]/40 shadow-sm text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#F2A71B] uppercase tracking-wider flex items-center gap-1.5">
            📊 Statutory MIS Reports Generator
          </span>
          <div className="flex items-center gap-1">
            <Link href="/reports" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
              MIS Reports
            </Link>
            <Link href="/documents" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Documents
            </Link>
            <Link href="/notifications" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Gazette Notices
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition">
            My Dashboard →
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Statutory MIS Statements &amp; Audit Reports</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              National land acquisition progress analytics, treasury statements, and Parliamentary inquiry disclosures.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REPORT_TEMPLATES.map((rep) => (
            <div
              key={rep.id}
              className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#122C4A] bg-[#FDF8E3] border border-[#E7DFB8] px-2.5 py-0.5 rounded uppercase">
                    {rep.category}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">{rep.period}</span>
                </div>

                <h3 className="text-lg font-bold text-[#122C4A] mb-2">{rep.title}</h3>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  {rep.description}
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs flex justify-between text-gray-700 mb-4">
                  <span>Audited Database Rows:</span>
                  <strong className="text-[#122C4A]">{rep.recordsCount} Records</strong>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleExportCsv(rep.title)}
                  className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold py-2 px-4 rounded transition shadow-sm flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>

                <button
                  onClick={() => handlePrint(rep.title)}
                  className="border border-[#122C4A] text-[#122C4A] hover:bg-gray-50 text-xs font-bold py-2 px-4 rounded transition flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
