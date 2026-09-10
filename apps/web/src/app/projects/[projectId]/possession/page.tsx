'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService, type AuthUser } from '../../../../services/auth.service';
import { apiClient } from '../../../../services/api-client';

export default function ProjectPossessionPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session.user);
    loadRecords();
  }, [projectId]);

  const loadRecords = async () => {
    try { setLoading(true); const data = await apiClient.get(`/possession?projectId=${projectId}`); setRecords(data as any || []); }
    catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try { setError(''); await apiClient.patch(`/possession/${id}`, { status }); await loadRecords(); }
    catch (err: any) { setError(err.message); }
  };

  const canManage = user && ['ADMIN','CENTRAL_OFFICER','STATE_OFFICER','DISTRICT_OFFICER','FIELD_OFFICER'].includes(user.role);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold text-[#122C4A] mb-6">Possession Records</h2>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
      : records.length === 0 ? <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">No possession records</div>
      : <div className="space-y-4">
          {records.map((r: any) => (
            <div key={r.id} className="bg-white border border-[#E8E4D9] rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-[#122C4A]">Parcel: {r.parcel?.parcelNumber || r.parcelId}</div>
                  <div className="text-xs text-[#5B6472] mt-1">Officer: {r.fieldOfficer?.name || '—'} • {r.parcel?.village || ''}</div>
                  {r.remarks && <div className="text-xs text-[#5B6472] mt-1">{r.remarks}</div>}
                  {r.latitude && <div className="text-xs text-[#5B6472] mt-1">GPS: {Number(r.latitude).toFixed(4)}, {Number(r.longitude).toFixed(4)}</div>}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status?.replace(/_/g,' ')}</span>
              </div>
              {canManage && r.status !== 'COMPLETED' && (
                <div className="mt-3 pt-3 border-t border-[#E8E4D9] flex gap-2">
                  {r.status === 'ELIGIBLE' && <button onClick={() => handleUpdateStatus(r.id, 'VERIFICATION_PENDING')} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Start Verification</button>}
                  {r.status === 'VERIFICATION_PENDING' && <button onClick={() => handleUpdateStatus(r.id, 'VERIFIED')} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Mark Verified</button>}
                  {r.status === 'VERIFIED' && <button onClick={() => handleUpdateStatus(r.id, 'POSSESSION_RECORDED')} className="text-xs bg-purple-600 text-white px-3 py-1 rounded">Record Possession</button>}
                  {r.status === 'POSSESSION_RECORDED' && <button onClick={() => handleUpdateStatus(r.id, 'COMPLETED')} className="text-xs bg-green-600 text-white px-3 py-1 rounded">Complete</button>}
                </div>
              )}
            </div>
          ))}
        </div>}
    </div>
  );
}
