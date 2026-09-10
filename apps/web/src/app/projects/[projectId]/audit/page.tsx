'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '../../../../services/api-client';

export default function ProjectAuditPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try { setLoading(true); const data = await apiClient.get(`/audit?projectId=${projectId}`); setLogs(data as any || []); }
      catch (err: any) { setError(err.message); } finally { setLoading(false); }
    })();
  }, [projectId]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold text-[#122C4A] mb-6">Audit Log</h2>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
      : logs.length === 0 ? <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">No audit entries</div>
      : <div className="bg-white border border-[#E8E4D9] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F5F3ED] border-b border-[#E8E4D9]">
              <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Timestamp</th>
              <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Action</th>
              <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Entity</th>
              <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Description</th>
            </tr></thead>
            <tbody>{logs.map((l: any) => (
              <tr key={l.id} className="border-b border-[#F0EDE5]">
                <td className="px-4 py-3 text-xs text-[#5B6472] whitespace-nowrap">{new Date(l.createdAt).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">{l.action}</span></td>
                <td className="px-4 py-3 text-xs text-[#5B6472]">{l.entityType}</td>
                <td className="px-4 py-3 text-xs text-[#5B6472]">{l.description || '—'}</td>
              </tr>))}
            </tbody>
          </table>
        </div>}
    </div>
  );
}
