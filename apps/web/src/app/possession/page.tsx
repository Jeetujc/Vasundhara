'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/header';
import { possessionService } from '../../services/possession.service';

export default function PossessionPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPossessions();
  }, []);

  const loadPossessions = async () => {
    try {
      setLoading(true);
      const data = await possessionService.list();
      setRecords((data as any[]) || []);
    } catch (err) {
      console.error('Failed to load possession records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPossession = async (id: string) => {
    try {
      setProcessingId(id);
      await possessionService.update(id, {
        status: 'POSSESSION_RECORDED',
      });
      alert('Physical possession officially recorded under Section 38. Panchnama issued.');
      await loadPossessions();
    } catch (err: any) {
      alert(err?.message || 'Failed to update possession status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDownloadPanchnama = (rec: any) => {
    const text = `GOVERNMENT OF MADHYA PRADESH - REVENUE DEPARTMENT
DISTRICT COLLECTORATE, JABALPUR (CALA LAND CELL)
------------------------------------------------------------
DIGITAL PANCHNAMA OF PHYSICAL POSSESSION (SECTION 38)
Date: ${new Date().toLocaleDateString('en-IN')}
Project: ${rec.project?.name || 'NH-44 Highway Widening'}
Khasra No: ${rec.parcel?.parcelNumber || '452/1'}
Village: ${rec.parcel?.village || 'Rau / Panagar'}
GPS Coordinates: ${rec.latitude || '23.1815'}°N, ${rec.longitude || '79.9864'}°E
Field Officer: ${rec.fieldOfficer?.name || 'Jabalpur Field Officer / Patwari'}
Status: Possession Officially Recorded & Peg-Marked.
------------------------------------------------------------
We, the undersigned Panches & Revenue Authorities, verify that
physical possession of the scheduled land has been taken over peacefully
and handed over to the Requiring Body.
[DIGITALLY SIGNED & SEALED - CALA]`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Panchnama_Khasra_${(rec.parcel?.parcelNumber || '452_1').replace('/', '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430]">
      <Header />

      {/* Sub-nav */}
      <nav className="bg-[#0E243D] text-white px-8 py-2.5 flex flex-wrap items-center justify-between border-b border-[#1D5FA8]/40 shadow-sm text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#F2A71B] uppercase tracking-wider flex items-center gap-1.5">
            🏁 Section 38 Physical Possession
          </span>
          <div className="flex items-center gap-1">
            <Link href="/possession" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
              Possession Registry
            </Link>
            <Link href="/dashboard/field" className="text-amber-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10 font-bold">
              ⚡ Field Officer Work Management
            </Link>
            <Link href="/gis" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              GIS Peg Map
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/workflow" className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition">
            Workflow Stages →
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Physical Possession Records (Section 38)</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              Field walkover evidence, GPS peg-marking coordinates, and statutory digital panchnamas.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/field"
              className="bg-[#B96E22] hover:bg-[#965516] text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm flex items-center gap-1.5"
            >
              ⚡ Field Survey Workspace
            </Link>
            <Link
              href="/gis"
              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm flex items-center gap-1.5"
            >
              View on GIS Map
            </Link>
          </div>
        </div>

        {/* Possession Records Table */}
        <div className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DDD8C8] bg-gray-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#122C4A]">Possession Registry ({records.length})</h2>
            <span className="text-xs text-gray-500 font-semibold">RFCTLARR 2013 Statutory Compliance</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
            </div>
          ) : records.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">No possession records recorded.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                    <th className="px-5 py-3">Parcel / Project</th>
                    <th className="px-4 py-3">GPS Peg Coordinates</th>
                    <th className="px-4 py-3">Field Officer</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Remarks</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {records.map((rec) => {
                    const isRecorded =
                      rec.status === 'POSSESSION_RECORDED' || rec.status === 'COMPLETED';

                    return (
                      <tr key={rec.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-4">
                          <div className="font-bold text-[#122C4A] text-sm">
                            Khasra {rec.parcel?.parcelNumber || '452/1'}
                          </div>
                          <div className="text-[10px] text-[#1D5FA8]">
                            {rec.project?.name || 'NH-44 Highway Widening'}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Village: {rec.parcel?.village || 'Rau / Panagar'}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono">
                          {rec.latitude ? (
                            <div>
                              <div className="text-[#122C4A] font-bold">
                                {Number(rec.latitude).toFixed(4)}° N
                              </div>
                              <div className="text-gray-500">
                                {Number(rec.longitude).toFixed(4)}° E
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Not surveyed</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-gray-800">
                            {rec.fieldOfficer?.name || 'Jabalpur Field Officer'}
                          </div>
                          <div className="text-[10px] text-gray-500">Revenue Inspector / Patwari</div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                              isRecorded
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {rec.status?.replace(/_/g, ' ') || 'ELIGIBLE'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-600 max-w-xs">
                          {rec.remarks || 'Preliminary peg-marking and boundary walkover completed.'}
                        </td>
                        <td className="px-5 py-4 text-right space-y-1.5 whitespace-nowrap">
                          {!isRecorded ? (
                            <button
                              onClick={() => handleRecordPossession(rec.id)}
                              disabled={processingId === rec.id}
                              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold py-1 px-3 rounded text-[11px] transition shadow-sm block w-full disabled:opacity-50"
                            >
                              {processingId === rec.id ? 'Recording...' : 'Record Possession'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDownloadPanchnama(rec)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1 px-3 rounded text-[11px] transition shadow-sm block w-full"
                            >
                              Download Panchnama
                            </button>
                          )}
                          <Link
                            href={`/gis/parcels?parcelId=${rec.parcelId}`}
                            className="text-[11px] font-bold text-[#1D5FA8] hover:underline block"
                          >
                            View on GIS Map →
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
