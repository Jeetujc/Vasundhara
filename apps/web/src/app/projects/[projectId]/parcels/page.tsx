'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService, type AuthUser } from '../../../../services/auth.service';
import { parcelService } from '../../../../services/parcel.service';

export default function ProjectParcelsPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [parcels, setParcels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ parcelNumber: '', surveyNumber: '', village: '', tehsil: '', area: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session.user);
    loadParcels();
  }, [projectId]);

  const loadParcels = async () => {
    try {
      setLoading(true);
      const data = await parcelService.list({ projectId });
      setParcels(data as any);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.parcelNumber) { setError('Parcel number is required'); return; }
    try {
      setSaving(true); setError('');
      await parcelService.create({ projectId, parcelNumber: form.parcelNumber, surveyNumber: form.surveyNumber || undefined, village: form.village || undefined, tehsil: form.tehsil || undefined, area: form.area ? parseFloat(form.area) : undefined });
      setForm({ parcelNumber: '', surveyNumber: '', village: '', tehsil: '', area: '' });
      setShowForm(false);
      await loadParcels();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const canCreate = user && ['ADMIN', 'CENTRAL_OFFICER', 'STATE_OFFICER', 'DISTRICT_OFFICER'].includes(user.role);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#122C4A]">Land Parcels</h2>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)}
            className="bg-[#1D5FA8] hover:bg-[#174C8A] text-white px-4 py-2 rounded-lg text-sm font-semibold">
            {showForm ? 'Cancel' : '+ Add Parcel'}
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-[#E8E4D9] rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-[#122C4A] mb-4">New Parcel</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5B6472] mb-1">Parcel Number *</label>
              <input type="text" value={form.parcelNumber} onChange={(e) => setForm({ ...form, parcelNumber: e.target.value })}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" placeholder="e.g. 452/1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B6472] mb-1">Survey Number</label>
              <input type="text" value={form.surveyNumber} onChange={(e) => setForm({ ...form, surveyNumber: e.target.value })}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" placeholder="e.g. SV-452-A" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B6472] mb-1">Village</label>
              <input type="text" value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" placeholder="e.g. Rau" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B6472] mb-1">Tehsil</label>
              <input type="text" value={form.tehsil} onChange={(e) => setForm({ ...form, tehsil: e.target.value })}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" placeholder="e.g. Panagar" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B6472] mb-1">Area (Hectares)</label>
              <input type="number" step="0.01" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" placeholder="e.g. 2.45" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-4 bg-[#1D5FA8] hover:bg-[#174C8A] text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
            {saving ? 'Saving...' : 'Create Parcel'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
      ) : parcels.length === 0 ? (
        <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">No parcels yet</div>
      ) : (
        <div className="bg-white border border-[#E8E4D9] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F5F3ED] border-b border-[#E8E4D9]">
              <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Parcel #</th>
              <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Survey #</th>
              <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Village</th>
              <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Tehsil</th>
              <th className="text-right px-4 py-3 font-semibold text-[#122C4A]">Area (Ha)</th>
              <th className="text-left px-4 py-3 font-semibold text-[#122C4A]">Status</th>
            </tr></thead>
            <tbody>
              {parcels.map((p: any) => (
                <tr key={p.id} className="border-b border-[#F0EDE5] hover:bg-[#FDFCF8]">
                  <td className="px-4 py-3 font-medium text-[#122C4A]">{p.parcelNumber}</td>
                  <td className="px-4 py-3 text-[#5B6472]">{p.surveyNumber || '—'}</td>
                  <td className="px-4 py-3 text-[#5B6472]">{p.village || '—'}</td>
                  <td className="px-4 py-3 text-[#5B6472]">{p.tehsil || '—'}</td>
                  <td className="px-4 py-3 text-right text-[#5B6472]">{p.area ? Number(p.area) : '—'}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{p.status?.replace(/_/g, ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
