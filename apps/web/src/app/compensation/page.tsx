'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/header';
import { compensationService } from '../../services/compensation.service';
import { authService, type AuthUser } from '../../services/auth.service';

export default function CompensationListPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [disbursingId, setDisbursingId] = useState<string | null>(null);

  useEffect(() => {
    const session = authService.getSession();
    if (session?.user) setUser(session.user);
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await compensationService.list();
      setCases((data as any[]) || []);
    } catch (err: any) {
      console.error('Failed to load compensation cases:', err);
      setError(err?.message || 'Failed to fetch compensation records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async (id: string) => {
    try {
      setDisbursingId(id);
      await compensationService.updatePayment(id, {
        paymentStatus: 'DISBURSED',
        paidAmount: 8050000,
        pendingAmount: 0,
      });
      alert('PFMS DBT payment order generated & disbursed successfully.');
      await loadCases();
    } catch (err: any) {
      alert(err?.message || 'Payment disbursement failed.');
    } finally {
      setDisbursingId(null);
    }
  };

  const filtered = cases.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      q === '' ||
      (c.family?.headOfFamily && c.family.headOfFamily.toLowerCase().includes(q)) ||
      (c.parcel?.parcelNumber && c.parcel.parcelNumber.toLowerCase().includes(q)) ||
      (c.project?.name && c.project.name.toLowerCase().includes(q));

    const matchesStatus = statusFilter === '' || c.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAssessed = cases.reduce((acc, c) => acc + Number(c.approvedAmount || 0), 0);
  const totalPaid = cases.reduce((acc, c) => acc + Number(c.paidAmount || 0), 0);
  const totalPending = cases.reduce((acc, c) => acc + Number(c.pendingAmount || c.approvedAmount || 0), 0);

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430]">
      <Header />

      {/* Sub-nav */}
      <nav className="bg-[#0E243D] text-white px-8 py-2.5 flex flex-wrap items-center justify-between border-b border-[#1D5FA8]/40 shadow-sm text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#F2A71B] uppercase tracking-wider flex items-center gap-1.5">
            ₹ Compensation &amp; Award Management
          </span>
          <div className="flex items-center gap-1">
            <Link href="/compensation" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
              All Awards
            </Link>
            <Link href="/compensation/pending" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Pending Approvals
            </Link>
            <Link href="/audit" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              RFCTLARR Calculator
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/field" className="bg-[#B96E22] hover:bg-[#965516] text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1">
            ⚡ Field Officer Work Management
          </Link>
          <Link href="/gis" className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition">
            GIS Map →
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Statutory Land Acquisition Awards (Section 21)</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              Transparent RFCTLARR 2013 compensation calculations with 100% Solatium &amp; Direct Benefit Transfer tracking.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/audit"
              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold px-4 py-2.5 rounded transition shadow-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Open Solatium Calculator
            </Link>
          </div>
        </div>

        {/* Macro KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-[#DDD8C8] rounded-xl p-5 shadow-sm">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Assessed Awards
            </span>
            <span className="text-2xl font-serif font-bold text-[#122C4A]">
              {formatINR(totalAssessed || 8050000)}
            </span>
            <span className="text-[11px] text-gray-500 mt-1 block">RFCTLARR Compliant</span>
          </div>

          <div className="bg-white border border-[#DDD8C8] rounded-xl p-5 shadow-sm">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Disbursed (PFMS)
            </span>
            <span className="text-2xl font-serif font-bold text-green-700">
              {formatINR(totalPaid || 0)}
            </span>
            <span className="text-[11px] text-green-600 font-semibold mt-1 block">Aadhaar Linked Accounts</span>
          </div>

          <div className="bg-white border border-[#DDD8C8] rounded-xl p-5 shadow-sm">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Pending Disbursement
            </span>
            <span className="text-2xl font-serif font-bold text-amber-600">
              {formatINR(totalPending || 8050000)}
            </span>
            <span className="text-[11px] text-amber-700 mt-1 block">Under CALA Validation</span>
          </div>

          <div className="bg-[#0B1F35] text-white border border-[#1D5FA8] rounded-xl p-5 shadow-sm">
            <span className="block text-[10px] font-bold text-[#F2A71B] uppercase tracking-wider mb-1">
              Solatium Multiplier
            </span>
            <span className="text-2xl font-serif font-bold text-white">100%</span>
            <span className="text-[11px] text-[#9FB0C4] mt-1 block">Statutory Section 30 Guarantee</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[#DDD8C8] rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Landowner, Khasra or Project..."
              className="w-full text-xs bg-gray-50 border border-[#DDD8C8] rounded pl-8 pr-3 py-2"
            />
            <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Payment Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-gray-50 border border-[#DDD8C8] rounded px-3 py-2"
            >
              <option value="">All Payment Stages</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved by CALA</option>
              <option value="DISBURSED">Disbursed (PFMS)</option>
              <option value="FAILED">Failed / Bank Bounce</option>
            </select>
          </div>
        </div>

        {/* Awards Table */}
        <div className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DDD8C8] bg-gray-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#122C4A]">Award Cases ({filtered.length})</h2>
            <span className="text-xs text-gray-500 font-semibold">e-Signed under RFCTLARR Act 2013</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No compensation cases found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                    <th className="px-5 py-3">Landowner / PAF</th>
                    <th className="px-4 py-3">Khasra &amp; Project</th>
                    <th className="px-4 py-3">Basic Value</th>
                    <th className="px-4 py-3">Solatium (100%)</th>
                    <th className="px-4 py-3">Total Award</th>
                    <th className="px-4 py-3">Payment Stage</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item) => {
                    const approved = Number(item.approvedAmount || 8050000);
                    const basic = approved / 2; // Solatium is 100% of basic
                    const isDisbursed = item.paymentStatus === 'DISBURSED';

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-4">
                          <div className="font-bold text-[#122C4A] text-sm">
                            {item.family?.headOfFamily || 'Ramesh Patel'}
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono">
                            Ref: {item.family?.familyReference || 'FAM-JBP-001'}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Ph: {item.family?.contactNumber || '9555555555'}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-gray-800">
                            Khasra {item.parcel?.parcelNumber || '452/1'}
                          </div>
                          <div className="text-[10px] text-[#1D5FA8]">
                            {item.project?.name || 'NH-44 Highway Widening'}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {item.parcel?.village || 'Rau / Panagar'}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono font-medium text-gray-700">
                          {formatINR(basic)}
                        </td>
                        <td className="px-4 py-4 font-mono font-medium text-amber-700">
                          +{formatINR(basic)}
                        </td>
                        <td className="px-4 py-4 font-bold text-[#122C4A] text-sm">
                          {formatINR(approved)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                              isDisbursed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.paymentStatus || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right space-y-1 whitespace-nowrap">
                          {!isDisbursed && (
                            <button
                              onClick={() => handleDisburse(item.id)}
                              disabled={disbursingId === item.id}
                              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold py-1.5 px-3 rounded text-[11px] shadow-sm transition disabled:opacity-50 block w-full"
                            >
                              {disbursingId === item.id ? 'Processing...' : 'Disburse via PFMS'}
                            </button>
                          )}
                          <Link
                            href="/audit"
                            className="text-[11px] font-bold text-[#1D5FA8] hover:underline block"
                          >
                            Audit Breakdown →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
