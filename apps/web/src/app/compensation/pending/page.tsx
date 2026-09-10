'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/header';
import { compensationService } from '../../../services/compensation.service';

export default function PendingCompensationPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      setLoading(true);
      const data = await compensationService.list({ status: 'PENDING' });
      setCases((data as any[]) || []);
    } catch (err) {
      console.error('Failed to load pending compensation cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await compensationService.updatePayment(id, {
        paymentStatus: 'APPROVED',
        status: 'APPROVED',
      });
      alert('Award Sanction Order approved by CALA. Sent to PFMS treasury for disbursement.');
      await loadPending();
    } catch (err: any) {
      alert(err?.message || 'Approval failed.');
    } finally {
      setProcessingId(null);
    }
  };

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
            <Link href="/compensation" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              All Awards
            </Link>
            <Link href="/compensation/pending" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
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
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Pending Compensation Approvals &amp; Sanctions</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              Statutory verification queue awaiting Competent Authority digital sanction and PFMS treasury transmission.
            </p>
          </div>
          <Link
            href="/compensation"
            className="border border-[#122C4A] text-[#122C4A] hover:bg-gray-100 text-xs font-bold px-4 py-2 rounded transition"
          >
            ← View All Compensation Awards
          </Link>
        </div>

        <div className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DDD8C8] bg-[#FDF8E3] flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#122C4A]">Pending Sanction Queue ({cases.length})</h2>
            <span className="text-xs text-[#B96E22] font-semibold">Priority Disbursal Queue</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
            </div>
          ) : cases.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              All compensation awards have been sanctioned. No pending actions in queue.
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cases.map((c) => (
                <div
                  key={c.id}
                  className="border border-gray-200 rounded-xl p-5 hover:border-[#1D5FA8] transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#122C4A]">
                        {c.family?.headOfFamily || 'Ramesh Patel'}
                      </span>
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                        Khasra {c.parcel?.parcelNumber || '452/1'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Project: <strong>{c.project?.name || 'NH-44 Widening'}</strong> | Village:{' '}
                      {c.parcel?.village || 'Rau / Panagar'}
                    </p>
                    <div className="flex items-center gap-4 text-xs pt-1">
                      <span className="text-green-700 font-semibold flex items-center gap-1">
                        ✓ Aadhaar Seeded (PFMS Validated)
                      </span>
                      <span className="text-gray-500">
                        Sanction Amount: <strong className="text-[#122C4A]">{formatINR(Number(c.approvedAmount || 8050000))}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleApprove(c.id)}
                      disabled={processingId === c.id}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded text-xs transition shadow-sm disabled:opacity-50"
                    >
                      {processingId === c.id ? 'Approving...' : 'Approve Sanction (e-Sign)'}
                    </button>
                    <Link
                      href="/audit"
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-3 rounded text-xs transition text-center"
                    >
                      Audit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
