'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '../../../../services/api-client';

export default function ProjectTimelinePage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setLoading(true); const data = await apiClient.get(`/audit?projectId=${projectId}`); setLogs(data as any || []); }
      catch { } finally { setLoading(false); }
    })();
  }, [projectId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-[#122C4A] mb-6">Project Timeline</h2>
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
      : logs.length === 0 ? <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">No timeline events</div>
      : <div className="relative pl-8 space-y-6">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#E8E4D9]" />
          {logs.map((l: any) => (
            <div key={l.id} className="relative">
              <div className="absolute left-[-24px] w-4 h-4 bg-[#1D5FA8] rounded-full border-2 border-white" />
              <div className="bg-white border border-[#E8E4D9] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">{l.action}</span>
                  <span className="text-xs text-[#5B6472]">{new Date(l.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-2 text-sm text-[#5B6472]">{l.description || l.entityType}</div>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}
