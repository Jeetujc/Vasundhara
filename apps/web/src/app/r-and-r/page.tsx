'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/header';
import { rrService } from '../../services/rr.service';

export default function RrListPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    loadRrCases();
  }, []);

  const loadRrCases = async () => {
    try {
      setLoading(true);
      const data = await rrService.list();
      setCases((data as any[]) || []);
    } catch (err) {
      console.error('Failed to load R&R cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setApprovingId(id);
      await rrService.update(id, {
        status: 'COMPLETED',
        completedAt: new Date(),
      });
      alert('R&R Resettlement Package verified & executed successfully.');
      await loadRrCases();
    } catch (err: any) {
      alert(err?.message || 'Failed to update R&R record.');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430]">
      <Header />

      {/* Sub-nav */}
      <nav className="bg-[#0E243D] text-white px-8 py-2.5 flex flex-wrap items-center justify-between border-b border-[#1D5FA8]/40 shadow-sm text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#F2A71B] uppercase tracking-wider flex items-center gap-1.5">
            🏡 Rehabilitation &amp; Resettlement (R&amp;R)
          </span>
          <div className="flex items-center gap-1">
            <Link href="/r-and-r" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
              R&amp;R Claims Registry
            </Link>
            <Link href="/compensation" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Compensation Awards
            </Link>
            <Link href="/possession" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Possession Records
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
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Rehabilitation &amp; Resettlement (R&amp;R) Scheme</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              Statutory Second &amp; Third Schedule entitlements under RFCTLARR Act, 2013 for Project Affected Families (PAFs).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/field"
              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm"
            >
              Verify Family Ground Status
            </Link>
          </div>
        </div>

        {/* R&R Table */}
        <div className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DDD8C8] bg-gray-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#122C4A]">Project Affected Families R&amp;R Entitlements ({cases.length})</h2>
            <span className="text-xs text-gray-500 font-semibold">100% Statutory Resettlement Guarantee</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
            </div>
          ) : cases.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No R&amp;R claims registered.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                    <th className="px-5 py-3">Family Reference &amp; Head</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Entitlements Package</th>
                    <th className="px-4 py-3">Benefits Description</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cases.map((item) => {
                    const isCompleted = item.status === 'COMPLETED';

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
                            Members: {item.family?.numberOfMembers || 5} | Ph: {item.family?.contactNumber || '9555555555'}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-gray-800">
                            {item.project?.name || 'NH-44 Highway Widening'}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            Code: {item.project?.code || 'NH44-JBP'}
                          </div>
                        </td>
                        <td className="px-4 py-4 space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {item.housingSupport && (
                              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                Plot Allocated
                              </span>
                            )}
                            {item.financialAssistance && (
                              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                Displacement Grant
                              </span>
                            )}
                            {item.relocationSupport && (
                              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                Subsistence Allowance
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600 max-w-xs text-[11px]">
                          {item.benefitsDescription ||
                            'Housing plot allocated at Sector 4, Plot No. 12 + One-time Displacement Allowance of ₹50,000.'}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase ${
                              isCompleted
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status?.replace(/_/g, ' ') || 'IN PROGRESS'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap space-y-1">
                          {!isCompleted && (
                            <button
                              onClick={() => handleApprove(item.id)}
                              disabled={approvingId === item.id}
                              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold py-1 px-3 rounded text-[11px] transition shadow-sm block w-full disabled:opacity-50"
                            >
                              {approvingId === item.id ? 'Processing...' : 'Complete R&R Grant'}
                            </button>
                          )}
                          <Link
                            href={`/projects/${item.projectId}/r-and-r`}
                            className="text-[11px] font-bold text-[#1D5FA8] hover:underline block"
                          >
                            Project R&amp;R →
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
