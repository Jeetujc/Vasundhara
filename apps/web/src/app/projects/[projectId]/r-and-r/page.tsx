'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService, type AuthUser } from '../../../../services/auth.service';
import { apiClient } from '../../../../services/api-client';

export default function ProjectRandRPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session.user);
    loadCases();
  }, [projectId]);

  const loadCases = async () => {
    try { setLoading(true); const data = await apiClient.get(`/rr?projectId=${projectId}`); setCases(data as any || []); }
    catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try { setError(''); await apiClient.patch(`/rr/${id}`, { status }); await loadCases(); }
    catch (err: any) { setError(err.message); }
  };

  const canManage = user && ['ADMIN','CENTRAL_OFFICER','STATE_OFFICER','DISTRICT_OFFICER'].includes(user.role);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold text-[#122C4A] mb-6">Rehabilitation & Resettlement</h2>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
      : cases.length === 0 ? <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">No R&R cases</div>
      : <div className="space-y-4">
          {cases.map((c: any) => (
            <div key={c.id} className="bg-white border border-[#E8E4D9] rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-[#122C4A]">{c.family?.headOfFamily || c.family?.familyReference || c.familyId}</div>
                  <div className="text-xs text-[#5B6472] mt-1">{c.benefitsDescription || ''}</div>
                  <div className="flex gap-3 mt-2">
                    {c.housingSupport && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">🏠 Housing</span>}
                    {c.financialAssistance && <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">💰 Financial</span>}
                    {c.employmentSupport && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">💼 Employment</span>}
                    {c.relocationSupport && <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">🚚 Relocation</span>}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'COMPLETED' || c.status === 'CLOSED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{c.status}</span>
              </div>
              {canManage && !['COMPLETED','CLOSED'].includes(c.status) && (
                <div className="mt-3 pt-3 border-t border-[#E8E4D9] flex gap-2">
                  {c.status === 'ASSESSED' && <button onClick={() => handleUpdateStatus(c.id, 'APPROVED')} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Approve</button>}
                  {c.status === 'APPROVED' && <button onClick={() => handleUpdateStatus(c.id, 'IN_PROGRESS')} className="text-xs bg-orange-600 text-white px-3 py-1 rounded">Start</button>}
                  {c.status === 'IN_PROGRESS' && <button onClick={() => handleUpdateStatus(c.id, 'VERIFICATION_PENDING')} className="text-xs bg-purple-600 text-white px-3 py-1 rounded">Send for Verification</button>}
                  {c.status === 'VERIFICATION_PENDING' && <button onClick={() => handleUpdateStatus(c.id, 'COMPLETED')} className="text-xs bg-green-600 text-white px-3 py-1 rounded">Complete</button>}
                </div>
              )}
            </div>
          ))}
        </div>}
    </div>
  );
}
